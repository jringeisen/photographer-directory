<?php

use App\Models\Listing;
use App\Models\Portfolio;

test('sitemap includes static and dynamic routes', function () {
    $listing = Listing::factory()->create();
    $portfolio = Portfolio::factory()->for($listing)->create();

    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    $response->assertSee('/privacy', false);
    $response->assertSee('/terms', false);
    $response->assertSee("/listings/{$listing->id}", false);
    $response->assertSee("/portfolios/{$portfolio->id}", false);
});
