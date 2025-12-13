<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Models\Listing;
use App\Models\Portfolio;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageService
    ) {}

    public function index(Listing $listing)
    {
        $this->authorize('update', $listing);

        $listing->load(['portfolios.images']);

        return Inertia::render('Portfolios/Index', [
            'listing' => $listing,
        ]);
    }

    public function create(Listing $listing)
    {
        $this->authorize('update', $listing);

        return Inertia::render('Portfolios/Create', [
            'listing' => $listing,
        ]);
    }

    public function store(StorePortfolioRequest $request, Listing $listing)
    {
        $validated = $request->validated();
        $this->assertPortfolioImageLimit($validated);

        return DB::transaction(function () use ($validated, $request, $listing) {
            $portfolio = $listing->portfolios()->create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if ($request->hasFile('images')) {
                $this->imageService->uploadPortfolioImages($portfolio, $request->file('images'));
            }

            if (!empty($validated['uploaded_images'])) {
                $this->imageService->attachPortfolioUploads($portfolio, $validated['uploaded_images']);
            }

            return redirect()->route('listings.portfolios.index', $listing);
        });
    }

    public function show(Portfolio $portfolio)
    {
        $this->authorize('view', $portfolio);

        $portfolio->load(['listing', 'images']);

        return Inertia::render('Portfolios/Show', [
            'portfolio' => $portfolio,
        ]);
    }

    public function edit(Portfolio $portfolio)
    {
        $this->authorize('update', $portfolio);

        $portfolio->load(['listing', 'images']);

        return Inertia::render('Portfolios/Edit', [
            'portfolio' => $portfolio,
        ]);
    }

    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio)
    {
        $validated = $request->validated();
        $existingCount = $portfolio->images()->count() - count($validated['remove_images'] ?? []);
        $this->assertPortfolioImageLimit($validated, max(0, $existingCount));

        return DB::transaction(function () use ($validated, $request, $portfolio) {
            $portfolio->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if (!empty($validated['remove_images'])) {
                $this->imageService->removePortfolioImages($portfolio, $validated['remove_images']);
            }

            if ($request->hasFile('new_images')) {
                $this->imageService->uploadPortfolioImages($portfolio, $request->file('new_images'));
            }

            if (!empty($validated['uploaded_images'])) {
                $this->imageService->attachPortfolioUploads($portfolio, $validated['uploaded_images']);
            }

            if (!empty($validated['image_order'])) {
                $this->imageService->updatePortfolioImageOrder($portfolio, $validated['image_order']);
            }

            return redirect()->route('portfolios.show', $portfolio);
        });
    }

    public function destroy(Portfolio $portfolio)
    {
        $this->authorize('delete', $portfolio);

        $listingId = $portfolio->listing_id;

        $this->imageService->deleteAllPortfolioImages($portfolio);
        $portfolio->delete();

        return redirect()->route('listings.portfolios.index', $listingId);
    }

    protected function assertPortfolioImageLimit(array $validated, int $existingCount = 0, int $max = 50): void
    {
        $uploadsCount = count($validated['uploaded_images'] ?? []);
        $newFilesCount = count($validated['images'] ?? []);
        $newFilesCount += count($validated['new_images'] ?? []);
        $total = $existingCount + $uploadsCount + $newFilesCount;

        if ($total > $max) {
            throw ValidationException::withMessages([
                'images' => "You can upload a maximum of {$max} images.",
            ]);
        }
    }
}
