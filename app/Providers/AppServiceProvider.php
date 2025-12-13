<?php

namespace App\Providers;

use App\Models\Listing;
use App\Models\Portfolio;
use App\Policies\ListingPolicy;
use App\Policies\PortfolioPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Listing::class, ListingPolicy::class);
        Gate::policy(Portfolio::class, PortfolioPolicy::class);
    }
}
