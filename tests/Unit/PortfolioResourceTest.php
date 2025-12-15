<?php

namespace Tests\Unit;

use App\Http\Resources\PortfolioResource;
use App\Models\Listing;
use App\Models\Portfolio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_portfolio_resource_serializes_basic_fields(): void
    {
        $listing = Listing::factory()->create();
        $portfolio = Portfolio::factory()->for($listing)->create([
            'name' => 'Gallery',
            'description' => 'Shots',
        ]);

        $resource = PortfolioResource::make($portfolio)->toArray(request());

        $this->assertEquals($portfolio->id, $resource['id']);
        $this->assertEquals('Gallery', $resource['name']);
        $this->assertEquals('Shots', $resource['description']);
    }
}
