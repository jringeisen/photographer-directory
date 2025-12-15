<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;

class ImageLimitValidator
{
    public function assertWithinLimit(array $validated, int $limit, int $existingCount = 0, array $fields = ['images', 'new_images', 'uploaded_images']): void
    {
        $total = $existingCount;

        foreach ($fields as $field) {
            $total += count($validated[$field] ?? []);
        }

        if ($total > $limit) {
            throw ValidationException::withMessages([
                'images' => "You can upload a maximum of {$limit} images.",
            ]);
        }
    }
}
