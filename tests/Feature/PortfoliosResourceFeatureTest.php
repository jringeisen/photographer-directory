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

    public function test_portfolio_index_includes_listing_id_for_links(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->for($user)->create();

        $response = $this->actingAs($user)->get(route('listings.portfolios.index', $listing));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portfolios/Index')
            ->where('listing.id', $listing->id)
        );
    }

    public function test_portfolio_create_includes_listing_id_for_links(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->for($user)->create();

        $response = $this->actingAs($user)->get(route('listings.portfolios.create', $listing));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portfolios/Create')
            ->where('listing.id', $listing->id)
        );
    }

    public function test_guest_can_view_portfolio_publicly(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        $portfolio = Portfolio::factory()->for($listing)->create();

        $response = $this->get(route('portfolios.show', $portfolio));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Portfolios/Show')
            ->where('portfolio.id', $portfolio->id)
        );
    }

    public function test_hidden_listing_portfolio_returns_not_found_for_guests(): void
    {
        $listing = Listing::factory()->for(User::factory()->state(['verification_status' => 'rejected']))->create();
        $portfolio = Portfolio::factory()->for($listing)->create();

        $this->get(route('portfolios.show', $portfolio))->assertNotFound();
    }
}
