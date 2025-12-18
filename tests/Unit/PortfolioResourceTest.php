<?php

use App\Http\Resources\PortfolioResource;
use App\Models\Listing;
use App\Models\Portfolio;

test('portfolio resource serializes basic fields', function () {
    $listing = Listing::factory()->create();
    $portfolio = Portfolio::factory()->for($listing)->create([
        'name' => 'Gallery',
        'description' => 'Shots',
    ]);

    $resource = PortfolioResource::make($portfolio)->toArray(request());

    expect($resource['id'])->toBe($portfolio->id)
        ->and($resource['name'])->toBe('Gallery')
        ->and($resource['description'])->toBe('Shots');
});
