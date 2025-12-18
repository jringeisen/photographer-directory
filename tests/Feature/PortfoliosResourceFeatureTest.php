<?php

use App\Models\Listing;
use App\Models\Portfolio;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('portfolio show uses resource shape', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();
    $portfolio = Portfolio::factory()->for($listing)->create([
        'name' => 'Wedding Set',
        'description' => 'Weddings',
    ]);

    $response = actingAs($user)->get(route('portfolios.show', $portfolio));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolios/Show')
        ->where('portfolio.id', $portfolio->id)
        ->where('portfolio.name', 'Wedding Set')
        ->where('portfolio.listing.id', $listing->id)
    );
});

test('portfolio index includes listing id for links', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();

    $response = actingAs($user)->get(route('listings.portfolios.index', $listing));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolios/Index')
        ->where('listing.id', $listing->id)
    );
});

test('portfolio create includes listing id for links', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();

    $response = actingAs($user)->get(route('listings.portfolios.create', $listing));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolios/Create')
        ->where('listing.id', $listing->id)
    );
});

test('guest can view portfolio publicly', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    $portfolio = Portfolio::factory()->for($listing)->create();

    $response = get(route('portfolios.show', $portfolio));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Portfolios/Show')
        ->where('portfolio.id', $portfolio->id)
    );
});

test('hidden listing portfolio returns not found for guests', function () {
    $listing = Listing::factory()->for(User::factory()->state(['verification_status' => 'rejected']))->create();
    $portfolio = Portfolio::factory()->for($listing)->create();

    get(route('portfolios.show', $portfolio))->assertNotFound();
});
