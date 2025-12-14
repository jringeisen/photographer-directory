<?php

namespace Tests\Feature;

use App\Models\Flag;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_flag_listing_and_admin_resolves(): void
    {
        $owner = User::factory()->create();
        $reporter = User::factory()->create();
        $listing = $owner->listings()->create([
            'company_name' => 'Flagged Listing',
            'city' => 'Austin',
            'state' => 'TX',
            'email' => 'owner@example.com',
        ]);

        $this->actingAs($reporter)->post(route('listings.flag', $listing), [
            'reason' => 'Inaccurate info',
            'categories' => ['inaccurate'],
        ])->assertRedirect();

        $flag = Flag::first();
        $this->assertNotNull($flag);
        $this->assertEquals(Flag::STATUS_PENDING, $flag->status);

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.flags.resolve', $flag), ['admin_notes' => 'Reviewed'])
            ->assertRedirect();

        $flag->refresh();
        $this->assertEquals(Flag::STATUS_RESOLVED, $flag->status);
        $this->assertEquals($admin->id, $flag->resolved_by);
        $this->assertNotNull($flag->resolved_at);
    }

    public function test_admin_can_impersonate_and_return(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.impersonate.start', $user))
            ->assertRedirect(route('dashboard'));

        $this->assertEquals($user->id, auth()->id());
        $this->assertEquals($admin->id, session('impersonator_id'));

        $this->post(route('admin.impersonate.stop'))
            ->assertRedirect(route('dashboard'));

        $this->assertEquals($admin->id, auth()->id());
        $this->assertNull(session('impersonator_id'));
    }

    public function test_admin_can_export_verification_requests_as_csv(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        VerificationRequest::factory()->create([
            'business_name' => 'CSV Test Co',
            'owner_name' => 'Owner',
            'owner_email' => 'owner@example.com',
        ]);

        $response = $this->actingAs($admin)->get('/admin/verification/export');

        $response->assertOk();
        $this->assertStringContainsString('CSV Test Co', $response->streamedContent());
    }
}
