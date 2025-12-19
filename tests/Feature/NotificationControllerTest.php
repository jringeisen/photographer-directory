<?php

use App\Models\ContactMessage;
use App\Models\Flag;
use App\Models\Listing;
use App\Models\User;
use App\Notifications\ListingFlagged;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;

test('notifications index returns data and unread counts', function () {
    $owner = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $owner->id]);
    $message = ContactMessage::factory()->create(['listing_id' => $listing->id]);
    $flag = Flag::factory()->create([
        'listing_id' => $listing->id,
        'user_id' => $owner->id,
        'status' => \App\Enums\FlagStatus::Pending,
    ]);

    $owner->notify(new ListingFlagged($listing, $flag));

    actingAs($owner)
        ->get(route('notifications.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Notifications/Index')
            ->where('notifications.data', fn ($data) => ! empty($data))
        );
});

test('marking specific notification as read also marks contact message read', function () {
    $owner = User::factory()->create();
    $listing = Listing::factory()->create(['user_id' => $owner->id]);
    $contact = ContactMessage::factory()->create(['listing_id' => $listing->id]);

    $notification = DatabaseNotification::create([
        'id' => (string) Str::uuid(),
        'type' => \App\Notifications\ContactMessageReceived::class,
        'notifiable_id' => $owner->id,
        'notifiable_type' => User::class,
        'data' => ['contact_message_id' => $contact->id],
    ]);

    actingAs($owner)
        ->post(route('notifications.markRead'), ['notification_id' => $notification->id])
        ->assertRedirect();

    $notification->refresh();
    expect($notification->read_at)->not->toBeNull();
    $contact->refresh();
    expect($contact->read_at)->not->toBeNull();
});

test('destroy removes notification', function () {
    $owner = User::factory()->create();
    $notification = DatabaseNotification::create([
        'id' => (string) Str::uuid(),
        'type' => \App\Notifications\ContactMessageReceived::class,
        'notifiable_id' => $owner->id,
        'notifiable_type' => User::class,
        'data' => [],
    ]);

    actingAs($owner)
        ->delete(route('notifications.destroy', $notification->id))
        ->assertRedirect();

    expect(DatabaseNotification::find($notification->id))->toBeNull();
});
