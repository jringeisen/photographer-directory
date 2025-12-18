<?php

use App\Models\Listing;
use App\Models\ListingHighlight;
use App\Models\PhotographyType;
use App\Models\User;

test('can store listing with price and highlights', function () {
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
    expect($listing->starting_price_cents)->toBe(120000)
        ->and($listing->ending_price_cents)->toBe(350000)
        ->and($listing->highlights()->count())->toBe(2)
        ->and($listing->highlights()->orderBy('sort_order')->first()->body)->toBe('Fast turnarounds');
});

test('update listing replaces highlights and prices', function () {
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

    expect($listing->starting_price_cents)->toBe(150050)
        ->and($listing->ending_price_cents)->toBe(280000)
        ->and($listing->highlights()->count())->toBe(2);
    $this->assertDatabaseMissing('listing_highlights', ['body' => 'Old highlight']);
    expect($listing->highlights()->orderBy('sort_order')->first()->body)->toBe('New highlight');
});

test('ending price requires starting price', function () {
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
});
