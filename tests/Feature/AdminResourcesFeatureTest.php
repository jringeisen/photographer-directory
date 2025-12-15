<?php

namespace Tests\Feature;

use App\Enums\FlagStatus;
use App\Enums\VerificationStatus;
use App\Models\Flag;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminResourcesFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_flags_index_returns_resource_shape(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $flag = Flag::factory()->forListing()->forUser()->create([
            'status' => FlagStatus::Pending,
            'reason' => 'Test reason',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.flags.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Flags/Index')
                ->where('flags.data.0.id', $flag->id)
                ->where('flags.data.0.status', FlagStatus::Pending->value)
                ->where('flags.data.0.listing.id', $flag->listing_id)
            );
    }

    public function test_admin_verification_index_returns_resource_shape(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $requestingUser = User::factory()->create();
        $vr = VerificationRequest::factory()->for($requestingUser)->create([
            'status' => VerificationStatus::Pending,
            'business_name' => 'Resource Co',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.verification.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Verification/Index')
                ->where('requests.data.0.id', $vr->id)
                ->where('requests.data.0.business_name', 'Resource Co')
                ->where('requests.data.0.user.id', $requestingUser->id)
            );
    }
}
