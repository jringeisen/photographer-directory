<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Portfolio;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;

class PortfolioManager
{
    public function __construct(
        protected ImageUploadService $imageService,
        protected ImageLimitValidator $imageLimitValidator,
        protected DatabaseManager $db
    ) {}

    public function create(Request $request, Listing $listing, array $validated): Portfolio
    {
        $this->imageLimitValidator->assertWithinLimit($validated, 50);

        return $this->db->transaction(function () use ($validated, $request, $listing) {
            /** @var Portfolio $portfolio */
            $portfolio = $listing->portfolios()->create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            $this->attachImages($request, $portfolio, $validated);

            return $portfolio;
        });
    }

    public function update(Request $request, Portfolio $portfolio, array $validated): Portfolio
    {
        $existingCount = $portfolio->images()->count() - count($validated['remove_images'] ?? []);
        $this->imageLimitValidator->assertWithinLimit($validated, 50, max(0, $existingCount));

        return $this->db->transaction(function () use ($validated, $request, $portfolio) {
            $portfolio->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if (! empty($validated['remove_images'])) {
                $this->imageService->removePortfolioImages($portfolio, $validated['remove_images']);
            }

            $this->attachImages($request, $portfolio, $validated);

            if (! empty($validated['image_order'])) {
                $this->imageService->updatePortfolioImageOrder($portfolio, $validated['image_order']);
            }

            return $portfolio;
        });
    }

    public function delete(Portfolio $portfolio): void
    {
        $this->imageService->deleteAllPortfolioImages($portfolio);
        $portfolio->delete();
    }

    protected function attachImages(Request $request, Portfolio $portfolio, array $validated): void
    {
        if ($request->hasFile('images')) {
            $this->imageService->uploadPortfolioImages($portfolio, $request->file('images'));
        }

        if ($request->hasFile('new_images')) {
            $this->imageService->uploadPortfolioImages($portfolio, $request->file('new_images'));
        }

        if (! empty($validated['uploaded_images'])) {
            $this->imageService->attachPortfolioUploads($portfolio, $validated['uploaded_images']);
        }
    }
}
