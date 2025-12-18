<?php

use App\Models\Listing;
use App\Models\Portfolio;

test('public listing view increments counter', function () {
    $listing = Listing::factory()->create();

    $this->get(route('listings.public', $listing))
        ->assertStatus(200);

    $this->assertDatabaseHas('listings', [
        'id' => $listing->id,
        'views_count' => 1,
    ]);

    expect($listing->fresh()->last_viewed_at)->not->toBeNull();
});

test('contact message increments contacts counter', function () {
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
});

test('portfolio view increments listing and portfolio counters', function () {
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
});
