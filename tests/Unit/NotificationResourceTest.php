<?php

namespace Tests\Unit;

use App\Http\Resources\NotificationResource;
use App\Models\ContactMessage;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Tests\TestCase;

class NotificationResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_basic_serialization_without_contact(): void
    {
        $notification = DatabaseNotification::query()->create([
            'id' => (string) \Str::uuid(),
            'notifiable_type' => User::class,
            'notifiable_id' => User::factory()->create()->id,
            'data' => [
                'message' => 'Hello',
                'listing_id' => 5,
                'listing_name' => 'Test Listing',
            ],
            'type' => 'test',
        ]);

        $resource = NotificationResource::make([
            'id' => $notification->id,
            'data' => $notification->data,
            'type' => $notification->type,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at->toIso8601String(),
        ])->toArray(request());

        $this->assertEquals($notification->id, $resource['id']);
        $this->assertEquals('Hello', $resource['message_full']);
        $this->assertEquals(5, $resource['listing']['id']);
        $this->assertEquals('Test Listing', $resource['listing']['name']);
    }

    public function test_enriches_contact_message_when_present(): void
    {
        $listing = Listing::factory()->create(['company_name' => 'Photo Co']);
        $contact = ContactMessage::factory()->for($listing)->create([
            'message' => 'Client note',
        ]);

        $notification = DatabaseNotification::query()->create([
            'id' => (string) \Str::uuid(),
            'notifiable_type' => User::class,
            'notifiable_id' => User::factory()->create()->id,
            'data' => [
                'contact_message_id' => $contact->id,
                'listing_id' => $listing->id,
                'listing_name' => $listing->company_name,
            ],
            'type' => 'test',
        ]);

        $contactMessages = ContactMessage::query()->with('listing')->whereKey($contact->id)->get()->keyBy('id');

        $resource = NotificationResource::make([
            'id' => $notification->id,
            'data' => $notification->data,
            'type' => $notification->type,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at->toIso8601String(),
        ])->withContactMessages($contactMessages)->toArray(request());

        $this->assertEquals('Client note', $resource['message_full']);
        $this->assertEquals($listing->id, $resource['listing']['id']);
        $this->assertEquals($listing->company_name, $resource['listing']['name']);
    }
}
