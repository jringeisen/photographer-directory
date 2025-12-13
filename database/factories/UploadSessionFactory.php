<?php

namespace Database\Factories;

use App\Models\UploadSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UploadSession>
 */
class UploadSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $contentLength = $this->faker->numberBetween(2_500_000, 6_000_000);
        $partSize = 5 * 1024 * 1024;
        $partCount = (int) ceil($contentLength / $partSize);
        $directory = 'uploads/tmp/'.$this->faker->uuid();

        return [
            'public_id' => (string) Str::ulid(),
            'user_id' => User::factory(),
            'disk' => 's3',
            'purpose' => 'listing',
            'directory' => $directory,
            'filename' => 'photo-'.$this->faker->uuid().'.jpg',
            'content_type' => 'image/jpeg',
            'content_length' => $contentLength,
            'part_size' => $partSize,
            'part_count' => $partCount,
            'upload_id' => $this->faker->uuid(),
            'storage_path' => $directory.'/original.jpg',
            'status' => 'pending',
            'expires_at' => now()->addHour(),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => UploadSession::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }
}
