<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\post;

test('user can register and is logged in', function () {
    $response = post('/register', [
        'name' => 'New User',
        'email' => 'new@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'terms' => true,
    ]);

    $response->assertRedirect('/dashboard');
    $user = User::whereEmail('new@example.com')->first();
    expect($user)->not->toBeNull();
    assertAuthenticatedAs($user);
});

test('login with wrong credentials returns errors', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = post('/login', [
        'email' => $user->email,
        'password' => 'not-correct',
    ]);

    $response->assertSessionHasErrors('email');
    expect(session()->getOldInput('email'))->toBe($user->email);
});

test('user can logout', function () {
    $user = User::factory()->create();
    actingAs($user);

    $response = post(route('logout'));

    $response->assertRedirect('/');
    expect(Auth::check())->toBeFalse();
});
