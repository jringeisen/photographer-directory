<?php

namespace App\Http\Controllers;

use App\Enums\FlagStatus;
use App\Http\Requests\ListingSearchRequest;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Models\PhotographyType;
use App\Models\Portfolio;
use App\Services\ListingManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function __construct(
        protected ListingManager $listingManager
    ) {}

    public function index(ListingSearchRequest $request)
    {
        $searchTerm = $request->searchTerm() ?? '';

        $listings = Listing::search($searchTerm)
            ->orderBy('created_at', 'desc')
            ->query(fn ($query) => $query
                ->visible()
                ->with([
                    'photographyTypes',
                    'images' => fn ($q) => $q->orderBy('order')->limit(1),
                    'user:id,verification_status',
                ])
                ->withCount(['images', 'portfolios'])
            )
            ->paginate(12)
            ->withQueryString();
        $listings->through(fn (Listing $listing) => ListingResource::make($listing)->toArray($request));

        // Stats for trust indicators
        $stats = [
            'totalPhotographers' => Listing::visible()->count(),
            'totalImages' => ListingImage::whereHas('listing', fn ($listingQuery) => $listingQuery->visible())->count(),
            'totalPortfolios' => Portfolio::whereHas('listing', fn ($listingQuery) => $listingQuery->visible())->count(),
        ];

        [$visitorCity, $visitorState] = $this->resolveVisitorCity($request);
        $curatedListings = $this->curatedListings($visitorCity, $visitorState)
            ->map(fn (Listing $listing) => ListingResource::make($listing)->toArray($request));

        return Inertia::render('Home', [
            'listings' => $listings,
            'stats' => $stats,
            'filters' => ['q' => $searchTerm],
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
        $listing = $this->listingManager->create($request, $request->validated());

        return redirect()->route('listings.public', $listing);
    }

    public function show(Request $request, Listing $listing)
    {
        $this->authorize('view', $listing);

        $listing->load(['photographyTypes', 'images', 'portfolios.images', 'user:id,verification_status']);

        return Inertia::render('Listings/Show', [
            'listing' => ListingResource::make($listing)->toArray($request),
        ]);
    }

    public function showPublic(Request $request, Listing $listing)
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
                ->where('status', FlagStatus::Pending->value)
                ->where('created_at', '>=', now()->subDay()),
        ]);

        return Inertia::render('Listings/PublicShow', [
            'listing' => ListingResource::make($listing)->toArray($request),
            'canBypassHidden' => $canBypassHidden,
        ]);
    }

    public function edit(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $listing->load(['photographyTypes', 'images']);
        $photographyTypes = PhotographyType::availableFor(auth()->id())->get();

        return Inertia::render('Listings/Edit', [
            'listing' => ListingResource::make($listing)->toArray($request),
            'photographyTypes' => $photographyTypes,
        ]);
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $validated = $request->validated();

        $listing = $this->listingManager->update($request, $listing, $validated);

        return redirect()->route('dashboard');
    }

    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);

        $this->listingManager->delete($listing);

        return redirect()->route('dashboard');
    }
}
