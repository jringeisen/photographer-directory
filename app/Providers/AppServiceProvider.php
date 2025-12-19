<?php

namespace App\Providers;

use App\Models\Listing;
use App\Models\Portfolio;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Policies\ListingPolicy;
use App\Policies\PortfolioPolicy;
use App\Policies\VerificationRequestPolicy;
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
        Gate::before(function (User $user): ?bool {
            return $user->is_admin ? true : null;
        });

        Gate::policy(Listing::class, ListingPolicy::class);
        Gate::policy(Portfolio::class, PortfolioPolicy::class);
        Gate::policy(VerificationRequest::class, VerificationRequestPolicy::class);
    }
}
