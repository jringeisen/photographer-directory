<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('user can log in with remember option', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => true,
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($user);
    $response->assertCookie(Auth::getRecallerName());
});
