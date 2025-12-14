<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Flag>
 */
class FlagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'listing_id' => \App\Models\Listing::factory(),
            'user_id' => \App\Models\User::factory(),
            'status' => 'pending',
            'reason' => fake()->sentence(),
            'admin_notes' => null,
            'resolved_by' => null,
            'resolved_at' => null,
        ];
    }
}
