<?php

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Models\Listing;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Notifications\VerificationRequestApproved;
use App\Notifications\VerificationRequestRejected;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;

test('user can submit verification request', function () {
    $user = User::factory()->create();

    $payload = [
        'business_name' => 'Acme Photography',
        'owner_name' => 'Jane Owner',
        'owner_email' => 'jane@example.com',
    ];

    $response = actingAs($user)->post(route('verification.store'), $payload);

    $response->assertRedirect();

    assertDatabaseHas('verification_requests', [
        'user_id' => $user->id,
        'business_name' => 'Acme Photography',
        'status' => 'pending',
    ]);

    expect($user->fresh()->verification_status)->toBe(UserVerificationStatus::InReview);
});

test('cannot submit duplicate pending requests', function () {
    $user = User::factory()->create();

    VerificationRequest::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    $response = actingAs($user)->post(route('verification.store'), [
        'business_name' => 'Acme',
        'owner_name' => 'Jane',
        'owner_email' => 'jane@example.com',
    ]);

    $response->assertRedirect(route('verification.create'));
    assertDatabaseCount('verification_requests', 1);
});

test('admin can approve request and mark user verified', function () {
    Notification::fake();

    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create(['verification_status' => UserVerificationStatus::InReview->value]);
    $request = VerificationRequest::factory()->create([
        'user_id' => $user->id,
        'business_name' => 'Acme',
        'owner_name' => 'Owner',
        'owner_email' => 'owner@example.com',
        'status' => VerificationStatus::Pending->value,
    ]);

    $response = actingAs($admin)->post(route('admin.verification.approve', $request), [
        'admin_notes' => 'Looks good',
    ]);

    $response->assertRedirect();

    expect($request->fresh()->status)->toBe(VerificationStatus::Approved);
    expect($user->fresh()->verification_status)->toBe(UserVerificationStatus::Verified);

    Notification::assertSentTo($user, VerificationRequestApproved::class);
});

test('rejected users listings are hidden', function () {
    $user = User::factory()->create(['verification_status' => UserVerificationStatus::Rejected->value]);
    $listing = Listing::factory()->for($user)->create();

    $response = get(route('home'));

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
    );
});

test('admin can reject request and hide listings', function () {
    Notification::fake();

    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create(['verification_status' => UserVerificationStatus::InReview->value]);
    $listing = Listing::factory()->for($user)->create();
    $request = VerificationRequest::factory()->create([
        'user_id' => $user->id,
        'status' => VerificationStatus::Pending->value,
    ]);

    $response = actingAs($admin)->post(route('admin.verification.reject', $request), [
        'admin_notes' => 'Not found on BBB',
    ]);

    $response->assertRedirect();

    expect($request->fresh()->status)->toBe(VerificationStatus::Rejected);
    expect($user->fresh()->verification_status)->toBe(UserVerificationStatus::Rejected);

    Notification::assertSentTo($user, VerificationRequestRejected::class);

    get(route('home'))->assertInertia(fn ($page) => $page
        ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
    );
});
