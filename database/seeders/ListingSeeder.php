<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ListingSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $photographyTypes = PhotographyType::where('is_predefined', true)->get();

        if ($photographyTypes->isEmpty()) {
            $this->command->warn('No predefined photography types found. Run PhotographyTypeSeeder first.');

            return;
        }

        $this->command->info('Creating 10 users with listings...');

        $progressBar = $this->command->getOutput()->createProgressBar(10);

        User::factory(10)->create()->each(function (User $user) use ($photographyTypes, $progressBar) {
            $listingCount = rand(2, 3);

            Listing::factory($listingCount)
                ->for($user)
                ->create()
                ->each(function (Listing $listing) use ($photographyTypes) {
                    $listing->photographyTypes()->attach(
                        $photographyTypes->random(rand(2, 4))->pluck('id')
                    );

                    $this->seedImages($listing, rand(3, 5));
                });

            $progressBar->advance();
        });

        $progressBar->finish();
        $this->command->newLine();
        $this->command->info('Seeding complete!');
    }

    private function seedImages(Listing $listing, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $response = Http::get('https://picsum.photos/800/600');

            if ($response->failed()) {
                $this->command->warn("Failed to download image for listing {$listing->id}");

                continue;
            }

            $path = "listings/{$listing->id}/" . Str::uuid() . '.jpg';

            Storage::disk('s3')->put($path, $response->body());

            $listing->images()->create([
                'path' => $path,
                'filename' => "photo-{$i}.jpg",
                'order' => $i,
            ]);
        }
    }
}
