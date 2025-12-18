<?php

use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Models\ListingHighlight;
use App\Models\ListingImage;
use App\Models\PhotographyType;

test('listing resource includes eager loaded relations', function () {
    $listing = Listing::factory()->create();
    $type = PhotographyType::factory()->create(['is_predefined' => true]);
    $listing->photographyTypes()->attach($type);
    ListingImage::factory()->for($listing)->create(['path' => 's3://path.jpg']);
    $highlight = ListingHighlight::factory()->for($listing)->create(['body' => 'Fast delivery', 'sort_order' => 1]);

    $resource = ListingResource::make($listing->fresh(['photographyTypes', 'images', 'highlights']))->toArray(request());

    expect($resource['photography_types'][0]['id'] ?? null)->toBe($type->id)
        ->and($resource['images'][0]['path'] ?? null)->toBe('s3://path.jpg')
        ->and($resource['highlights'][0]['body'] ?? null)->toBe($highlight->body);
});
