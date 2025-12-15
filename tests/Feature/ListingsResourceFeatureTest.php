<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingsResourceFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_listing_uses_resource_shape(): void
    {
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
    }
}
