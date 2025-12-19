<?php

use App\Models\PhotographyType;
use App\Models\User;

test('availableFor scope returns predefined and user types', function () {
    $user = User::factory()->create();
    $predefined = PhotographyType::factory()->create(['is_predefined' => true, 'user_id' => null]);
    $custom = PhotographyType::factory()->create(['is_predefined' => false, 'user_id' => $user->id]);
    $other = PhotographyType::factory()->create(['is_predefined' => false]);

    $results = PhotographyType::availableFor($user->id)->get();

    expect($results->pluck('id'))->toContain($predefined->id, $custom->id)
        ->and($results->pluck('id'))->not->toContain($other->id);
});
