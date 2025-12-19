<?php

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('admin cannot impersonate themselves', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    actingAs($admin)
        ->post(route('admin.impersonate.start', $admin))
        ->assertRedirect()
        ->assertSessionHas('error');
});

test('stop impersonation with no session simply redirects', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    actingAs($admin);

    post(route('admin.impersonate.stop'))
        ->assertRedirect(route('dashboard'));
});
