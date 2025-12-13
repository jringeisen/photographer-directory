<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PhotographyTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Wedding',
            'Family',
            'Boudoir',
            'Portrait',
            'Newborn',
            'Maternity',
            'Engagement',
            'Commercial',
            'Event',
            'Headshot',
        ];

        foreach ($types as $type) {
            DB::table('photography_types')->insert([
                'name' => $type,
                'slug' => Str::slug($type),
                'is_predefined' => true,
                'user_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
