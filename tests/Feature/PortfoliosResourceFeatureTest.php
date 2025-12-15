<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfoliosResourceFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_portfolio_show_uses_resource_shape(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->for($user)->create();
        $portfolio = Portfolio::factory()->for($listing)->create([
            'name' => 'Wedding Set',
            'description' => 'Weddings',
        ]);

        $response = $this->actingAs($user)->get(route('portfolios.show', $portfolio));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portfolios/Show')
            ->where('portfolio.id', $portfolio->id)
            ->where('portfolio.name', 'Wedding Set')
            ->where('portfolio.listing.id', $listing->id)
        );
    }
}
