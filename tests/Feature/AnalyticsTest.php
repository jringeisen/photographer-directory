<?php

use App\Models\Listing;
use App\Models\Portfolio;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('public listing view increments counter', function () {
    $listing = Listing::factory()->create();

    get(route('listings.public', $listing))
        ->assertStatus(200);

    assertDatabaseHas('listings', [
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

    post(route('listings.contact', $listing), $payload)
        ->assertRedirect();

    assertDatabaseHas('listings', [
        'id' => $listing->id,
        'contacts_count' => 1,
    ]);
});

test('portfolio view increments listing and portfolio counters', function () {
    $listing = Listing::factory()->create();
    $portfolio = Portfolio::factory()->for($listing)->create();

    /** @var \App\Models\User $owner */
    $owner = $listing->user;

    actingAs($owner)
        ->get(route('portfolios.show', $portfolio))
        ->assertStatus(200);

    assertDatabaseHas('portfolios', [
        'id' => $portfolio->id,
        'views_count' => 1,
    ]);

    assertDatabaseHas('listings', [
        'id' => $listing->id,
        'portfolio_views_count' => 1,
    ]);
});
