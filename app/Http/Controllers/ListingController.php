<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Flag;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\PhotographyType;
use App\Models\Portfolio;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function __construct(
        protected ImageUploadService $imageService
    ) {}

    public function index(Request $request)
    {
        $query = Listing::query()
            ->visible()
            ->with([
                'photographyTypes',
                'images' => fn ($q) => $q->orderBy('order')->limit(1),
                'user:id,verification_status',
            ])
            ->withCount(['images', 'portfolios']);

        // Text search (company_name, city, state, description)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Photography type filter
        if ($typeId = $request->input('type')) {
            $query->whereHas('photographyTypes', fn ($q) => $q->where('photography_types.id', $typeId));
        }

        // Location filter
        if ($location = $request->input('location')) {
            $query->where(function ($q) use ($location) {
                if (str_contains($location, ',')) {
                    [$city, $state] = array_map('trim', explode(',', $location, 2));
                    $q->where('city', 'like', $city)->where('state', 'like', $state);
                } else {
                    $q->where('city', 'like', "%{$location}%")
                        ->orWhere('state', 'like', "%{$location}%");
                }
            });
        }

        $listings = $query->latest()->paginate(12)->withQueryString();

        // Get predefined photography types for filter dropdown
        $photographyTypes = PhotographyType::where('is_predefined', true)->get();

        // Get unique locations for filter
        $locations = Listing::query()
            ->visible()
            ->whereNotNull('city')
            ->whereNotNull('state')
            ->where('city', '!=', '')
            ->where('state', '!=', '')
            ->get(['city', 'state'])
            ->map(fn (Listing $listing) => trim("{$listing->city}, {$listing->state}", ', '))
            ->filter(fn ($location) => $location !== '' && $location !== ',')
            ->unique()
            ->values();

        // Stats for trust indicators
        $stats = [
            'totalPhotographers' => Listing::visible()->count(),
            'totalImages' => ListingImage::whereHas('listing', fn ($listingQuery) => $listingQuery->visible())->count(),
            'totalPortfolios' => Portfolio::whereHas('listing', fn ($listingQuery) => $listingQuery->visible())->count(),
        ];

        [$visitorCity, $visitorState] = $this->resolveVisitorCity($request);
        $curatedListings = $this->curatedListings($visitorCity, $visitorState);

        return Inertia::render('Home', [
            'listings' => $listings,
            'photographyTypes' => $photographyTypes,
            'locations' => $locations,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'location']),
            'curatedListings' => $curatedListings,
            'curatedCity' => $visitorCity,
        ]);
    }

    public function create()
    {
        $photographyTypes = PhotographyType::availableFor(auth()->id())->get();

        return Inertia::render('Listings/Create', [
            'photographyTypes' => $photographyTypes,
        ]);
    }

    protected function resolveVisitorCity(Request $request): array
    {
        $cityLabel = collect([
            $request->string('curated_city')->toString(),
            $request->header('CF-IPCity'),
            $request->header('X-City'),
            $request->header('X-Geo-City'),
        ])
            ->map(fn ($city) => $city ? trim($city) : null)
            ->first(fn ($city) => ! empty($city));

        $stateLabel = $request->string('curated_state')->toString() ?: null;

        return $this->parseLocationParts($cityLabel, $stateLabel);
    }

    protected function curatedListings(?string $city, ?string $state)
    {
        $city = $city ? trim($city) : null;
        $state = $state ? trim($state) : null;

        $baseQuery = Listing::visible()
            ->with([
                'photographyTypes',
                'images' => fn ($q) => $q->orderBy('order')->limit(1),
                'user:id,verification_status',
            ])
            ->withCount(['images', 'portfolios']);

        $selected = collect();

        if ($city) {
            $selected = (clone $baseQuery)
                ->whereRaw('LOWER(city) = LOWER(?)', [$city])
                ->inRandomOrder()
                ->limit(4)
                ->get();
        }

        if ($selected->count() < 4 && $state) {
            $needed = 4 - $selected->count();
            $stateMatches = (clone $baseQuery)
                ->whereRaw('LOWER(state) = LOWER(?)', [$state])
                ->whereNotIn('id', $selected->pluck('id'))
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $selected = $selected->concat($stateMatches);
        }

        if ($selected->count() < 4) {
            $needed = 4 - $selected->count();
            $fallback = (clone $baseQuery)
                ->whereNotIn('id', $selected->pluck('id'))
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            $selected = $selected->concat($fallback);
        }

        return $selected->take(4);
    }

    protected function parseLocationParts(?string $cityLabel, ?string $stateLabel): array
    {
        $city = null;
        $state = null;

        if ($cityLabel && str_contains($cityLabel, ',')) {
            [$cityPart, $statePart] = array_map('trim', explode(',', $cityLabel, 2));
            $city = $cityPart ?: null;
            $state = $statePart ?: null;
        } elseif ($cityLabel) {
            $city = $cityLabel;
        }

        if ($stateLabel) {
            $state = $state ?? $stateLabel;
        }

        return [$city, $state];
    }

    public function store(StoreListingRequest $request)
    {
        $validated = $request->validated();
        $this->assertListingImageLimit($validated);

        return DB::transaction(function () use ($validated, $request) {
            $listing = $request->user()->listings()->create([
                'company_name' => $validated['company_name'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            $typeIds = $validated['photography_types'] ?? [];
            if (! empty($validated['custom_types'])) {
                foreach ($validated['custom_types'] as $typeName) {
                    $customType = PhotographyType::firstOrCreate(
                        ['slug' => Str::slug($typeName), 'user_id' => $request->user()->id],
                        ['name' => $typeName, 'is_predefined' => false]
                    );
                    $typeIds[] = $customType->id;
                }
            }
            $listing->photographyTypes()->sync($typeIds);

            if ($request->hasFile('images')) {
                $this->imageService->uploadListingImages($listing, $request->file('images'));
            }

            if (! empty($validated['uploaded_images'])) {
                $this->imageService->attachListingUploads($listing, $validated['uploaded_images']);
            }

            return redirect()->route('listings.public', $listing);
        });
    }

    public function show(Listing $listing)
    {
        $this->authorize('view', $listing);

        $listing->load(['photographyTypes', 'images', 'portfolios.images', 'user:id,verification_status']);

        return Inertia::render('Listings/Show', [
            'listing' => $listing,
        ]);
    }

    public function showPublic(Listing $listing)
    {
        $canBypassHidden = auth()->user()?->is_admin === true || auth()->id() === $listing->user_id;

        if ($listing->isHiddenFromPublic() && ! $canBypassHidden) {
            abort(404);
        }

        Listing::whereKey($listing->id)->update([
            'views_count' => DB::raw('views_count + 1'),
            'last_viewed_at' => now(),
        ]);

        $listing->load([
            'photographyTypes',
            'images',
            'portfolios.images',
            'user:id,verification_status',
        ])->loadCount([
            'flags as pending_flags_count' => fn ($q) => $q
                ->where('status', Flag::STATUS_PENDING)
                ->where('created_at', '>=', now()->subDay()),
        ]);

        return Inertia::render('Listings/PublicShow', [
            'listing' => $listing,
            'canBypassHidden' => $canBypassHidden,
        ]);
    }

    public function edit(Listing $listing)
    {
        $this->authorize('update', $listing);

        $listing->load(['photographyTypes', 'images']);
        $photographyTypes = PhotographyType::availableFor(auth()->id())->get();

        return Inertia::render('Listings/Edit', [
            'listing' => $listing,
            'photographyTypes' => $photographyTypes,
        ]);
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $validated = $request->validated();
        $existingCount = $listing->images()->count() - count($validated['remove_images'] ?? []);
        $this->assertListingImageLimit($validated, max(0, $existingCount));

        return DB::transaction(function () use ($validated, $request, $listing) {
            $listing->update([
                'company_name' => $validated['company_name'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            $typeIds = $validated['photography_types'] ?? [];
            if (! empty($validated['custom_types'])) {
                foreach ($validated['custom_types'] as $typeName) {
                    $customType = PhotographyType::firstOrCreate(
                        ['slug' => Str::slug($typeName), 'user_id' => $request->user()->id],
                        ['name' => $typeName, 'is_predefined' => false]
                    );
                    $typeIds[] = $customType->id;
                }
            }
            $listing->photographyTypes()->sync($typeIds);

            if (! empty($validated['remove_images'])) {
                $this->imageService->removeListingImages($listing, $validated['remove_images']);
            }

            if ($request->hasFile('new_images')) {
                $this->imageService->uploadListingImages($listing, $request->file('new_images'));
            }

            if (! empty($validated['uploaded_images'])) {
                $this->imageService->attachListingUploads($listing, $validated['uploaded_images']);
            }

            return redirect()->route('dashboard', $listing);
        });
    }

    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);

        $this->imageService->deleteAllListingImages($listing);
        $listing->delete();

        return redirect()->route('dashboard');
    }

    protected function assertListingImageLimit(array $validated, int $existingCount = 0): void
    {
        $uploadsCount = count($validated['uploaded_images'] ?? []);
        $newFilesCount = count($validated['images'] ?? []);
        $newFilesCount += count($validated['new_images'] ?? []);
        $total = $existingCount + $uploadsCount + $newFilesCount;

        if ($total > 10) {
            throw ValidationException::withMessages([
                'images' => 'You can upload a maximum of 10 images.',
            ]);
        }
    }
}
