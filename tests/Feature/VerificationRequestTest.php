<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Notifications\VerificationRequestApproved;
use App\Notifications\VerificationRequestRejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class VerificationRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_verification_request(): void
    {
        $user = User::factory()->create();

        $payload = [
            'business_name' => 'Acme Photography',
            'owner_name' => 'Jane Owner',
            'owner_email' => 'jane@example.com',
        ];

        $response = $this->actingAs($user)->post(route('verification.store'), $payload);

        $response->assertRedirect();

        $this->assertDatabaseHas('verification_requests', [
            'user_id' => $user->id,
            'business_name' => 'Acme Photography',
            'status' => 'pending',
        ]);

        $this->assertEquals('in_review', $user->fresh()->verification_status);
    }

    public function test_cannot_submit_duplicate_pending_requests(): void
    {
        $user = User::factory()->create();

        VerificationRequest::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->post(route('verification.store'), [
            'business_name' => 'Acme',
            'owner_name' => 'Jane',
            'owner_email' => 'jane@example.com',
        ]);

        $response->assertRedirect(route('verification.create'));
        $this->assertDatabaseCount('verification_requests', 1);
    }

    public function test_admin_can_approve_request_and_mark_user_verified(): void
    {
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['verification_status' => 'in_review']);
        $request = VerificationRequest::factory()->create([
            'user_id' => $user->id,
            'business_name' => 'Acme',
            'owner_name' => 'Owner',
            'owner_email' => 'owner@example.com',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.verification.approve', $request), [
            'admin_notes' => 'Looks good',
        ]);

        $response->assertRedirect();

        $this->assertEquals('approved', $request->fresh()->status);
        $this->assertEquals('verified', $user->fresh()->verification_status);

        Notification::assertSentTo($user, VerificationRequestApproved::class);
    }

    public function test_rejected_users_listings_are_hidden(): void
    {
        $user = User::factory()->create(['verification_status' => 'rejected']);
        $listing = Listing::factory()->for($user)->create();

        $response = $this->get(route('home'));

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
        );
    }

    public function test_admin_can_reject_request_and_hide_listings(): void
    {
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['verification_status' => 'in_review']);
        $listing = Listing::factory()->for($user)->create();
        $request = VerificationRequest::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.verification.reject', $request), [
            'admin_notes' => 'Not found on BBB',
        ]);

        $response->assertRedirect();

        $this->assertEquals('rejected', $request->fresh()->status);
        $this->assertEquals('rejected', $user->fresh()->verification_status);

        Notification::assertSentTo($user, VerificationRequestRejected::class);

        $this->get(route('home'))->assertInertia(fn ($page) => $page
            ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
        );
    }
}
