<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingResource;
use App\Models\Flag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->listings()
            ->with(['photographyTypes', 'images'])
            ->withCount(['images', 'portfolios'])
            ->addSelect([
                'latest_flag_status' => Flag::select('status')
                    ->whereColumn('listing_id', 'listings.id')
                    ->latest('updated_at')
                    ->limit(1),
            ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%");
            });
        }

        $listings = $query->latest()->get();
        $listings = $listings->map(fn ($listing) => ListingResource::make($listing)->toArray($request));
        $analytics = [
            'total_views' => $listings->sum('views_count'),
            'total_contacts' => $listings->sum('contacts_count'),
            'total_portfolio_views' => $listings->sum('portfolio_views_count'),
            'top_listing' => $listings
                ->sortByDesc('views_count')
                ->first(),
        ];

        return Inertia::render('Dashboard', [
            'listings' => $listings,
            'filters' => [
                'search' => $search,
            ],
            'analytics' => $analytics,
        ]);
    }
}
