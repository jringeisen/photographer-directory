<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\Portfolio;
use App\Models\User;

class PortfolioPolicy
{
    public function view(User $user, Portfolio $portfolio): bool
    {
        return $this->ownsPortfolio($user, $portfolio);
    }

    public function update(User $user, Portfolio $portfolio): bool
    {
        return $this->ownsPortfolio($user, $portfolio);
    }

    public function delete(User $user, Portfolio $portfolio): bool
    {
        return $this->ownsPortfolio($user, $portfolio);
    }

    protected function ownsPortfolio(User $user, Portfolio $portfolio): bool
    {
        $listing = $portfolio->listing;

        return $listing instanceof Listing && $user->id === $listing->user_id;
    }
}
