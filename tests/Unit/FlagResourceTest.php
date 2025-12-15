<?php

namespace Tests\Unit;

use App\Enums\FlagStatus;
use App\Http\Resources\FlagResource;
use App\Models\Flag;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FlagResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_flag_resource_serializes_core_fields(): void
    {
        $flag = Flag::factory()->create([
            'status' => FlagStatus::Pending,
            'reason' => 'Inaccurate info',
        ]);

        $resource = FlagResource::make($flag)->toArray(request());

        $this->assertEquals($flag->id, $resource['id']);
        $this->assertEquals(FlagStatus::Pending->value, $resource['status']);
        $this->assertEquals('Inaccurate info', $resource['reason']);
    }

    public function test_flag_resource_includes_listing_and_reporter(): void
    {
        $flag = Flag::factory()
            ->forListing()
            ->forUser()
            ->create([
                'status' => FlagStatus::Resolved,
                'admin_notes' => 'Reviewed',
            ]);

        $resource = FlagResource::make($flag->fresh(['listing', 'user']))->toArray(request());

        $this->assertEquals($flag->listing_id, $resource['listing']['id']);
        $this->assertEquals($flag->user->name, $resource['reporter']['name']);
        $this->assertEquals('Reviewed', $resource['admin_notes']);
        $this->assertEquals(FlagStatus::Resolved->value, $resource['status']);
    }
}
