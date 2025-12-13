<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\User;
use App\Notifications\ContactMessageReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_contact_form_and_owner_is_notified(): void
    {
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

        $this->assertSame(1, $owner->notifications()->count());
        $data = $owner->notifications()->first()->data;
        $this->assertSame($listing->id, $data['listing_id']);
        $this->assertSame('jane@example.com', $data['from_email']);
    }

    public function test_validation_blocks_invalid_contact_messages(): void
    {
        $listing = Listing::factory()->create();

        $response = $this->post(route('listings.contact', $listing), [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'message']);

        $this->assertDatabaseCount('contact_messages', 0);
        $this->assertDatabaseCount('notifications', 0);
    }

    public function test_user_can_mark_notifications_as_read_and_contact_message_is_updated(): void
    {
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

        $this->assertSame(1, $user->unreadNotifications()->count());
        $this->assertNull($contactMessage->fresh()->read_at);

        $this->actingAs($user)->post(route('notifications.markRead'), [
            'notification_id' => $notificationId,
        ])->assertRedirect();

        $this->assertSame(0, $user->fresh()->unreadNotifications()->count());
        $this->assertNotNull($contactMessage->fresh()->read_at);
    }
}
