<?php

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Http\Resources\VerificationRequestResource;
use App\Models\User;
use App\Models\VerificationRequest;

test('serializes core fields', function () {
    $vr = VerificationRequest::factory()->create([
        'business_name' => 'Acme',
        'owner_name' => 'Owner',
        'owner_email' => 'owner@example.com',
        'status' => VerificationStatus::Pending,
    ]);

    $resource = VerificationRequestResource::make($vr)->toArray(request());

    expect($resource['id'])->toBe($vr->id)
        ->and($resource['business_name'])->toBe('Acme')
        ->and($resource['status'])->toBe(VerificationStatus::Pending->value);
});

test('includes user snapshot', function () {
    $user = User::factory()->create(['verification_status' => UserVerificationStatus::InReview->value]);
    $vr = VerificationRequest::factory()->for($user)->create([
        'status' => VerificationStatus::Approved,
    ]);

    $resource = VerificationRequestResource::make($vr->fresh('user'))->toArray(request());

    expect($resource['user']['id'])->toBe($user->id)
        ->and($resource['user']['verification_status'])->toBe(UserVerificationStatus::InReview->value)
        ->and($resource['status'])->toBe(VerificationStatus::Approved->value);
});
