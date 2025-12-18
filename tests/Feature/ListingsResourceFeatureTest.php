<?php

use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\Portfolio;
use App\Models\User;

test('public listing uses resource shape', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create(['company_name' => 'Resource Co']);
    $type = PhotographyType::factory()->create(['is_predefined' => true]);
    $listing->photographyTypes()->attach($type);

    $response = $this->get(route('listings.public', $listing));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Listings/PublicShow')
        ->where('listing.company_name', 'Resource Co')
        ->where('listing.photography_types.0.id', $type->id)
        ->where('listing.pending_flags_count', 0)
    );
});

test('public listing includes portfolios for links', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();
    $portfolio = Portfolio::factory()->for($listing)->create();

    $response = $this->get(route('listings.public', $listing));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Listings/PublicShow')
        ->where('listing.portfolios.0.id', $portfolio->id)
    );
});
