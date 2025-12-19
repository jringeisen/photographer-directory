<?php

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Models\User;
use App\Models\VerificationRequest;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('user can submit verification when none pending', function () {
    $user = User::factory()->create();
    actingAs($user);

    post(route('verification.store'), [
        'business_name' => 'Biz',
        'owner_name' => 'Owner',
        'owner_email' => 'owner@example.com',
        'website' => 'https://example.com',
    ])->assertRedirect(route('verification.create'));

    $request = VerificationRequest::first();
    expect($request)->not->toBeNull();
    expect($request->status)->toBe(VerificationStatus::Pending);
    $user->refresh();
    expect($user->verification_status)->toBe(UserVerificationStatus::InReview);
});

test('cannot submit when pending exists', function () {
    $user = User::factory()->create();
    VerificationRequest::factory()->create([
        'user_id' => $user->id,
        'status' => VerificationStatus::Pending,
    ]);

    actingAs($user)
        ->post(route('verification.store'), [
            'business_name' => 'Biz',
            'owner_name' => 'Owner',
            'owner_email' => 'owner@example.com',
            'website' => 'https://example.com',
        ])
        ->assertRedirect(route('verification.create'))
        ->assertSessionHas('error');
});
