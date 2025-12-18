<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\ListingHighlight;
use App\Models\PhotographyType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingPriceAndHighlightsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_store_listing_with_price_and_highlights(): void
    {
        $user = User::factory()->create();
        $type = PhotographyType::factory()->create(['is_predefined' => true]);

        $response = $this->actingAs($user)->post('/listings', [
            'company_name' => 'Price Co',
            'city' => 'Austin',
            'state' => 'TX',
            'phone' => '1234567890',
            'description' => 'Great work',
            'photography_types' => [$type->id],
            'custom_types' => [],
            'starting_price' => '1200',
            'ending_price' => '3500',
            'highlights' => ['Fast turnarounds', 'Drone coverage'],
            'uploaded_images' => [],
        ]);

        $response->assertRedirect();

        $listing = Listing::latest()->first();
        $this->assertEquals(120000, $listing->starting_price_cents);
        $this->assertEquals(350000, $listing->ending_price_cents);
        $this->assertEquals(2, $listing->highlights()->count());
        $this->assertEquals('Fast turnarounds', $listing->highlights()->orderBy('sort_order')->first()->body);
    }

    public function test_update_listing_replaces_highlights_and_prices(): void
    {
        $user = User::factory()->create();
        $type = PhotographyType::factory()->create(['is_predefined' => true]);
        $listing = Listing::factory()->for($user)->create([
            'starting_price_cents' => 50000,
            'ending_price_cents' => 80000,
        ]);
        ListingHighlight::factory()->for($listing)->create(['body' => 'Old highlight']);
        $listing->photographyTypes()->attach($type);

        $response = $this->actingAs($user)->put("/listings/{$listing->id}", [
            'company_name' => 'Updated Co',
            'city' => 'Dallas',
            'state' => 'TX',
            'phone' => '1234567890',
            'description' => 'New desc',
            'photography_types' => [$type->id],
            'custom_types' => [],
            'starting_price' => '1500.50',
            'ending_price' => '2800',
            'highlights' => ['New highlight', 'Second line'],
            'uploaded_images' => [],
            'remove_images' => [],
        ]);

        $response->assertRedirect('/dashboard');

        $listing->refresh();

        $this->assertEquals(150050, $listing->starting_price_cents);
        $this->assertEquals(280000, $listing->ending_price_cents);
        $this->assertEquals(2, $listing->highlights()->count());
        $this->assertDatabaseMissing('listing_highlights', ['body' => 'Old highlight']);
        $this->assertEquals('New highlight', $listing->highlights()->orderBy('sort_order')->first()->body);
    }

    public function test_ending_price_requires_starting_price(): void
    {
        $user = User::factory()->create();
        $type = PhotographyType::factory()->create(['is_predefined' => true]);

        $response = $this->actingAs($user)->from('/listings/create')->post('/listings', [
            'company_name' => 'Price Co',
            'city' => 'Austin',
            'state' => 'TX',
            'phone' => '1234567890',
            'photography_types' => [$type->id],
            'custom_types' => [],
            'ending_price' => '3000',
        ]);

        $response->assertRedirect('/listings/create');
        $response->assertSessionHasErrors(['starting_price']);
    }
}
