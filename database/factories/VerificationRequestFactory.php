<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationRequest>
 */
class VerificationRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'business_name' => fake()->company().' Photography',
            'legal_entity_type' => 'LLC',
            'registration_number' => strtoupper(fake()->bothify('##??##')),
            'registration_state' => fake()->randomElement(['CA', 'TX', 'NY', 'FL', 'WA', 'IL']),
            'business_address' => fake()->address(),
            'owner_name' => fake()->name(),
            'owner_email' => fake()->safeEmail(),
            'owner_phone' => fake()->phoneNumber(),
            'website' => fake()->url(),
            'bbb_profile_url' => 'https://www.bbb.org/profile/'.fake()->uuid(),
            'status' => 'pending',
            'submitted_at' => now(),
        ];
    }
}
