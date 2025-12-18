<?php

namespace Tests;

use Illuminate\Foundation\Vite;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('scout.driver', 'collection');
        $this->ensureViteManifestExists();
    }

    protected function ensureViteManifestExists(): void
    {
        /** @var Vite $vite */
        $vite = app(Vite::class);
        $manifestPath = public_path($vite->isRunningHot() ? 'hot/manifest.json' : 'build/manifest.json');

        if (! is_file($manifestPath)) {
            if (! is_dir(dirname($manifestPath))) {
                mkdir(dirname($manifestPath), recursive: true);
            }

            file_put_contents(
                $manifestPath,
                json_encode([
                    'resources/js/app.js' => [
                        'file' => 'assets/app.js',
                        'isEntry' => true,
                    ],
                    'resources/css/app.css' => [
                        'file' => 'assets/app.css',
                        'isEntry' => true,
                    ],
                ], JSON_PRETTY_PRINT)
            );
        }
    }
}
