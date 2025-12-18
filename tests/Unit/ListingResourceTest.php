<?php

use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Models\User;

test('listing resource serializes basic fields', function () {
    $listing = Listing::factory()->for(User::factory()->create())->create([
        'company_name' => 'Studio',
        'city' => 'Austin',
        'state' => 'TX',
    ]);

    $resource = ListingResource::make($listing)->toArray(request());

    expect($resource['id'])->toBe($listing->id)
        ->and($resource['company_name'])->toBe('Studio')
        ->and($resource['city'])->toBe('Austin')
        ->and($resource['state'])->toBe('TX');
});

test('listing resource formats price', function () {
    $listing = Listing::factory()->for(User::factory()->create())->create([
        'starting_price_cents' => 100000,
        'ending_price_cents' => 250000,
    ]);

    $resource = ListingResource::make($listing)->toArray(request());

    expect($resource['price']['starting_price'])->toBe('1000.00')
        ->and($resource['price']['ending_price'])->toBe('2500.00')
        ->and($resource['price']['label'])->toBe('Packages between $1,000.00 and $2,500.00');
});
