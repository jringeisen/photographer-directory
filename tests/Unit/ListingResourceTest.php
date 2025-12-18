<?php

namespace Tests\Unit;

use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_resource_serializes_basic_fields(): void
    {
        $listing = Listing::factory()->for(User::factory()->create())->create([
            'company_name' => 'Studio',
            'city' => 'Austin',
            'state' => 'TX',
        ]);

        $resource = ListingResource::make($listing)->toArray(request());

        $this->assertEquals($listing->id, $resource['id']);
        $this->assertEquals('Studio', $resource['company_name']);
        $this->assertEquals('Austin', $resource['city']);
        $this->assertEquals('TX', $resource['state']);
    }

    public function test_listing_resource_formats_price(): void
    {
        $listing = Listing::factory()->for(User::factory()->create())->create([
            'starting_price_cents' => 100000,
            'ending_price_cents' => 250000,
        ]);

        $resource = ListingResource::make($listing)->toArray(request());

        $this->assertEquals('1000.00', $resource['price']['starting_price']);
        $this->assertEquals('2500.00', $resource['price']['ending_price']);
        $this->assertEquals('Packages between $1,000.00 and $2,500.00', $resource['price']['label']);
    }
}
