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
}
