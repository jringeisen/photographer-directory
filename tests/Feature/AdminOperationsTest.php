<?php

use App\Enums\FlagStatus;
use App\Models\Flag;
use App\Models\User;
use App\Models\VerificationRequest;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('user can flag listing and admin resolves', function () {
    $owner = User::factory()->create();
    $reporter = User::factory()->create();
    $listing = $owner->listings()->create([
        'company_name' => 'Flagged Listing',
        'city' => 'Austin',
        'state' => 'TX',
        'email' => 'owner@example.com',
    ]);

    actingAs($reporter)->post(route('listings.flag', $listing), [
        'reason' => 'Inaccurate info',
        'categories' => ['inaccurate'],
    ])->assertRedirect();

    $flag = Flag::first();
    expect($flag)->not->toBeNull();
    expect($flag->status)->toBe(FlagStatus::Pending);

    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.flags.resolve', $flag), ['admin_notes' => 'Reviewed'])
        ->assertRedirect();

    $flag->refresh();
    expect($flag->status)->toBe(FlagStatus::Resolved)
        ->and($flag->resolved_by)->toBe($admin->id)
        ->and($flag->resolved_at)->not->toBeNull();
});

test('admin can impersonate and return', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();

    actingAs($admin)
        ->post(route('admin.impersonate.start', $user))
        ->assertRedirect(route('dashboard'));

    expect(auth()->id())->toBe($user->id)
        ->and(session('impersonator_id'))->toBe($admin->id);

    post(route('admin.impersonate.stop'))
        ->assertRedirect(route('dashboard'));

    expect(auth()->id())->toBe($admin->id)
        ->and(session('impersonator_id'))->toBeNull();
});

test('admin can export verification requests as csv', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    VerificationRequest::factory()->create([
        'business_name' => 'CSV Test Co',
        'owner_name' => 'Owner',
        'owner_email' => 'owner@example.com',
    ]);

    $response = actingAs($admin)->get('/admin/verification/export');

    $response->assertOk();
    expect($response->streamedContent())->toContain('CSV Test Co');
});
