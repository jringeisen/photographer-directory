<?php

use App\Http\Resources\NotificationResource;
use App\Models\ContactMessage;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;

test('basic serialization without contact', function () {
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

    expect($resource['id'])->toBe($notification->id)
        ->and($resource['message_full'])->toBe('Hello')
        ->and($resource['listing']['id'])->toBe(5)
        ->and($resource['listing']['name'])->toBe('Test Listing');
});

test('enriches contact message when present', function () {
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

    expect($resource['message_full'])->toBe('Client note')
        ->and($resource['listing']['id'])->toBe($listing->id)
        ->and($resource['listing']['name'])->toBe($listing->company_name);
});
