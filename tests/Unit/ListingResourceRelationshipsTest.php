<?php

namespace Tests\Unit;

use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Models\ListingHighlight;
use App\Models\ListingImage;
use App\Models\PhotographyType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListingResourceRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_listing_resource_includes_eager_loaded_relations(): void
    {
        $listing = Listing::factory()->create();
        $type = PhotographyType::factory()->create(['is_predefined' => true]);
        $listing->photographyTypes()->attach($type);
        ListingImage::factory()->for($listing)->create(['path' => 's3://path.jpg']);
        $highlight = ListingHighlight::factory()->for($listing)->create(['body' => 'Fast delivery', 'sort_order' => 1]);

        $resource = ListingResource::make($listing->fresh(['photographyTypes', 'images', 'highlights']))->toArray(request());

        $this->assertEquals($type->id, $resource['photography_types'][0]['id'] ?? null);
        $this->assertEquals('s3://path.jpg', $resource['images'][0]['path'] ?? null);
        $this->assertEquals($highlight->body, $resource['highlights'][0]['body'] ?? null);
    }
}
