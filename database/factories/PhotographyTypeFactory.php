<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PhotographyType>
 */
class PhotographyTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Wedding',
            'Portrait',
            'Landscape',
            'Event',
            'Product',
            'Food',
            'Architecture',
            'Fashion',
            'Sports',
            'Wildlife',
            'Street',
            'Documentary',
            'Aerial',
            'Macro',
            'Newborn',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'is_predefined' => true,
            'user_id' => null,
        ];
    }

    public function predefined(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_predefined' => true,
            'user_id' => null,
        ]);
    }

    public function custom(int $userId): static
    {
        return $this->state(fn (array $attributes) => [
            'is_predefined' => false,
            'user_id' => $userId,
        ]);
    }
}
