<?php

use App\Models\Listing;
use App\Models\User;
use App\Notifications\ContactMessageReceived;
use Illuminate\Support\Facades\Mail;

test('guest can submit contact form and owner is notified', function () {
    Mail::fake();

    $owner = User::factory()->create();
    $listing = Listing::factory()->for($owner)->create();

    $payload = [
        'name' => 'Jane Client',
        'email' => 'jane@example.com',
        'phone' => '555-1234',
        'message' => 'I would love to book a session next month.',
    ];

    $response = $this->post(route('listings.contact', $listing), $payload);

    $response->assertRedirect();

    $this->assertDatabaseHas('contact_messages', [
        'listing_id' => $listing->id,
        'email' => 'jane@example.com',
        'name' => 'Jane Client',
    ]);

    $owner->refresh();

    expect($owner->notifications()->count())->toBe(1);
    $data = $owner->notifications()->first()->data;
    expect($data['listing_id'])->toBe($listing->id)
        ->and($data['from_email'])->toBe('jane@example.com');
});

test('validation blocks invalid contact messages', function () {
    $listing = Listing::factory()->create();

    $response = $this->post(route('listings.contact', $listing), [
        'name' => '',
        'email' => 'not-an-email',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'message']);

    $this->assertDatabaseCount('contact_messages', 0);
    $this->assertDatabaseCount('notifications', 0);
});

test('user can mark notifications as read and contact message is updated', function () {
    Mail::fake();

    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();
    $contactMessage = $listing->contactMessages()->create([
        'name' => 'Interested Client',
        'email' => 'client@example.com',
        'message' => 'Can we discuss availability?',
    ]);

    $user->notify(new ContactMessageReceived($listing, $contactMessage));

    $notificationId = $user->notifications()->first()->id;

    expect($user->unreadNotifications()->count())->toBe(1)
        ->and($contactMessage->fresh()->read_at)->toBeNull();

    $this->actingAs($user)->post(route('notifications.markRead'), [
        'notification_id' => $notificationId,
    ])->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0)
        ->and($contactMessage->fresh()->read_at)->not->toBeNull();
});
