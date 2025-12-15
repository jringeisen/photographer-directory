<?php

namespace Tests\Unit;

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Http\Resources\VerificationRequestResource;
use App\Models\User;
use App\Models\VerificationRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerificationRequestResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_serializes_core_fields(): void
    {
        $vr = VerificationRequest::factory()->create([
            'business_name' => 'Acme',
            'owner_name' => 'Owner',
            'owner_email' => 'owner@example.com',
            'status' => VerificationStatus::Pending,
        ]);

        $resource = VerificationRequestResource::make($vr)->toArray(request());

        $this->assertEquals($vr->id, $resource['id']);
        $this->assertEquals('Acme', $resource['business_name']);
        $this->assertEquals(VerificationStatus::Pending->value, $resource['status']);
    }

    public function test_includes_user_snapshot(): void
    {
        $user = User::factory()->create(['verification_status' => UserVerificationStatus::InReview->value]);
        $vr = VerificationRequest::factory()->for($user)->create([
            'status' => VerificationStatus::Approved,
        ]);

        $resource = VerificationRequestResource::make($vr->fresh('user'))->toArray(request());

        $this->assertEquals($user->id, $resource['user']['id']);
        $this->assertEquals(UserVerificationStatus::InReview->value, $resource['user']['verification_status']);
        $this->assertEquals(VerificationStatus::Approved->value, $resource['status']);
    }
}
