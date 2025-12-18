<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\post;

test('user can log in with remember option', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
    ]);

    $response = post('/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $response->assertRedirect('/dashboard');
    assertAuthenticatedAs($user);
    $response->assertCookie(Auth::getRecallerName());
});
