<?php

use App\Enums\FlagStatus;
use App\Models\Listing;
use App\Models\User;
use App\Notifications\ListingFlagged;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

test('pending flagged listing is hidden from homepage', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    foreach (range(1, 5) as $i) {
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Pending->value,
            'reason' => 'Inaccurate information',
            'created_at' => now(),
        ]);
    }

    $response = get(route('home'));

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
    );
});

test('rejected flagged listing is hidden from homepage', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    $listing->flags()->create([
        'user_id' => null,
        'status' => FlagStatus::Rejected->value,
        'reason' => 'Content rejected',
    ]);

    $response = get(route('home'));

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
    );
});

test('resolved flagged listing is visible again', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    $listing->flags()->create([
        'user_id' => null,
        'status' => FlagStatus::Resolved->value,
        'reason' => 'Issue fixed',
    ]);

    $response = get(route('home'));

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('listings.data', fn ($list) => collect($list)->pluck('id')->contains($listing->id))
    );
});

test('pending flagged listing cannot be viewed publicly', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    foreach (range(1, 5) as $i) {
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Pending->value,
            'reason' => 'Spam',
            'created_at' => now(),
        ]);
    }

    get(route('listings.public', $listing))->assertNotFound();
});

test('rejected flagged listing cannot be viewed publicly', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    $listing->flags()->create([
        'user_id' => null,
        'status' => FlagStatus::Rejected->value,
        'reason' => 'Rejected listing',
    ]);

    get(route('listings.public', $listing))->assertNotFound();
});

test('dashboard shows rejected reporting status', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();
    $listing->flags()->create([
        'user_id' => null,
        'status' => FlagStatus::Rejected->value,
        'reason' => 'Rejected listing',
    ]);

    $response = actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->where('listings', fn ($listings) => collect($listings)->firstWhere('id', $listing->id)['reporting_status'] === 'rejected')
    );
});

test('pending flagged listing cannot receive contact messages', function () {
    $listing = Listing::factory()->for(User::factory())->create();
    foreach (range(1, 5) as $i) {
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Pending->value,
            'reason' => 'Suspicious activity',
            'created_at' => now(),
        ]);
    }

    $response = post(route('listings.contact', $listing), [
        'name' => 'Visitor',
        'email' => 'visitor@example.com',
        'message' => 'Hello there',
    ]);

    $response->assertNotFound();
    assertDatabaseCount('contact_messages', 0);
});

test('admin can view flagged listing with banner data', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $listing = Listing::factory()->for(User::factory())->create();
    $listing->flags()->create([
        'user_id' => null,
        'status' => FlagStatus::Pending->value,
        'reason' => 'Review needed',
    ]);

    $response = actingAs($admin)->get(route('listings.public', $listing));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Listings/PublicShow')
        ->where('listing.pending_flags_count', 1)
        ->where('canBypassHidden', true)
    );
});

test('owner is notified when listing is flagged', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $listing = Listing::factory()->for($owner)->create();

    post(route('listings.flag', $listing), [
        'reason' => 'Concerning content',
        'categories' => ['spam'],
    ])->assertRedirect();

    Notification::assertSentTo($owner, ListingFlagged::class);
});

test('guest can report listing', function () {
    $owner = User::factory()->create();
    $listing = Listing::factory()->for($owner)->create();

    post(route('listings.flag', $listing), [
        'reason' => 'Problematic listing',
        'categories' => ['inaccurate'],
    ])->assertRedirect();

    assertDatabaseHas('flags', [
        'listing_id' => $listing->getKey(),
        'ip_address' => '127.0.0.1',
    ]);
});

test('ip rate limit blocks abuse', function () {
    $listing = Listing::factory()->for(User::factory())->create();

    foreach (range(1, 5) as $i) {
        post(route('listings.flag', $listing), [
            'reason' => "Abuse attempt {$i}",
            'categories' => ['spam'],
        ])->assertRedirect();
    }

    $response = post(route('listings.flag', $listing), [
        'reason' => 'Too many',
        'categories' => ['spam'],
    ]);

    $response->assertSessionHasErrors('reason');
    assertDatabaseCount('flags', 5);
});
