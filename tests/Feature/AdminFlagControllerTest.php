<?php

use App\Enums\FlagStatus;
use App\Models\Flag;
use App\Models\User;

use function Pest\Laravel\actingAs;

test('admin can reject a flag', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $flag = Flag::factory()->create([
        'status' => FlagStatus::Pending,
    ]);

    actingAs($admin)
        ->post(route('admin.flags.reject', $flag), ['admin_notes' => 'no issue'])
        ->assertRedirect();

    $flag->refresh();
    expect($flag->status)->toBe(FlagStatus::Rejected)
        ->and($flag->resolved_by)->toBe($admin->id)
        ->and($flag->resolved_at)->not->toBeNull();
});
