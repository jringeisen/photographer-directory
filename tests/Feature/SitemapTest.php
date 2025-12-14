<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\Portfolio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_includes_static_and_dynamic_routes(): void
    {
        $listing = Listing::factory()->create();
        $portfolio = Portfolio::factory()->for($listing)->create();

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee('/privacy', false);
        $response->assertSee('/terms', false);
        $response->assertSee("/listings/{$listing->id}", false);
        $response->assertSee("/portfolios/{$portfolio->id}", false);
    }
}
