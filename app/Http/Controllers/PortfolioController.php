<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Models\Listing;
use App\Models\Portfolio;
use App\Services\PortfolioManager;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function __construct(
        protected PortfolioManager $portfolioManager
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
        $portfolio = $this->portfolioManager->create($request, $listing, $validated);

        return redirect()->route('listings.portfolios.index', $listing);
    }

    public function show(Portfolio $portfolio)
    {
        $this->authorize('view', $portfolio);

        Portfolio::whereKey($portfolio->id)->update([
            'views_count' => DB::raw('views_count + 1'),
            'last_viewed_at' => now(),
        ]);
        $portfolio->listing()->increment('portfolio_views_count');

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
        $portfolio = $this->portfolioManager->update($request, $portfolio, $validated);

        return redirect()->route('portfolios.show', $portfolio);
    }

    public function destroy(Portfolio $portfolio)
    {
        $this->authorize('delete', $portfolio);

        $listingId = $portfolio->listing_id;

        $this->portfolioManager->delete($portfolio);

        return redirect()->route('listings.portfolios.index', $listingId);
    }
}
