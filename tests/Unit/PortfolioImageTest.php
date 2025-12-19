<?php

use App\Models\PortfolioImage;
use Illuminate\Support\Facades\Storage;

test('portfolio image url uses storage temporary url', function () {
    Storage::shouldReceive('disk->temporaryUrl')
        ->once()
        ->andReturn('https://s3.example.com/temp-url');

    $image = new PortfolioImage(['path' => 'images/test.jpg']);

    expect($image->url)->toBe('https://s3.example.com/temp-url');
});
