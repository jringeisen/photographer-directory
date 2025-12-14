<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Portfolio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listing_view_increments_counter(): void
    {
        $listing = Listing::factory()->create();

        $this->get(route('listings.public', $listing))
            ->assertStatus(200);

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'views_count' => 1,
        ]);

        $this->assertNotNull($listing->fresh()->last_viewed_at);
    }

    public function test_contact_message_increments_contacts_counter(): void
    {
        $listing = Listing::factory()->create([
            'email' => 'owner@example.com',
        ]);

        $payload = [
            'name' => 'Client',
            'email' => 'client@example.com',
            'message' => 'Hello there',
            'phone' => '555-1234',
        ];

        $this->post(route('listings.contact', $listing), $payload)
            ->assertRedirect();

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'contacts_count' => 1,
        ]);
    }

    public function test_portfolio_view_increments_listing_and_portfolio_counters(): void
    {
        $listing = Listing::factory()->create();
        $portfolio = Portfolio::factory()->for($listing)->create();

        $this->actingAs($listing->user)
            ->get(route('portfolios.show', $portfolio))
            ->assertStatus(200);

        $this->assertDatabaseHas('portfolios', [
            'id' => $portfolio->id,
            'views_count' => 1,
        ]);

        $this->assertDatabaseHas('listings', [
            'id' => $listing->id,
            'portfolio_views_count' => 1,
        ]);
    }
}
