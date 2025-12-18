<?php

use App\Enums\FlagStatus;
use App\Http\Resources\FlagResource;
use App\Models\Flag;

test('flag resource serializes core fields', function () {
    $flag = Flag::factory()->create([
        'status' => FlagStatus::Pending,
        'reason' => 'Inaccurate info',
    ]);

    $resource = FlagResource::make($flag)->toArray(request());

    expect($resource['id'])->toBe($flag->id)
        ->and($resource['status'])->toBe(FlagStatus::Pending->value)
        ->and($resource['reason'])->toBe('Inaccurate info');
});

test('flag resource includes listing and reporter', function () {
    $flag = Flag::factory()
        ->forListing()
        ->forUser()
        ->create([
            'status' => FlagStatus::Resolved,
            'admin_notes' => 'Reviewed',
        ]);

    $resource = FlagResource::make($flag->fresh(['listing', 'user']))->toArray(request());

    expect($resource['listing']['id'])->toBe($flag->listing_id)
        ->and($resource['reporter']['name'])->toBe($flag->user->name)
        ->and($resource['admin_notes'])->toBe('Reviewed')
        ->and($resource['status'])->toBe(FlagStatus::Resolved->value);
});
