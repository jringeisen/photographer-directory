<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(15)
            ->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'type' => $notification->type,
                    'read_at' => $notification->read_at?->toIso8601String(),
                    'created_at' => $notification->created_at->toIso8601String(),
                ];
            });

        $contactMessageIds = collect($notifications->items())
            ->pluck('data.contact_message_id')
            ->filter()
            ->unique()
            ->all();

        $contactMessages = ContactMessage::with('listing')
            ->whereIn('id', $contactMessageIds)
            ->get()
            ->keyBy('id');

        $notifications->setCollection(
            $notifications->getCollection()->map(function ($notification) use ($contactMessages) {
                $contact = isset($notification['data']['contact_message_id'])
                    ? $contactMessages->get($notification['data']['contact_message_id'])
                    : null;

                return [
                    ...$notification,
                    'message_full' => $contact?->message ?? $notification['data']['message'] ?? null,
                    'listing' => $contact?->listing
                        ? [
                            'id' => $contact->listing->id,
                            'name' => $contact->listing->company_name,
                        ]
                        : [
                            'id' => $notification['data']['listing_id'] ?? null,
                            'name' => $notification['data']['listing_name'] ?? null,
                        ],
                ];
            })
        );

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'notification_id' => ['nullable', 'string', 'exists:notifications,id'],
        ]);

        $user = $request->user();

        if (! $user) {
            return back();
        }

        if (! empty($data['notification_id'])) {
            $notification = $user->notifications()->whereKey($data['notification_id'])->first();

            if ($notification && $notification->read_at === null) {
                $notification->markAsRead();
                $this->markContactMessageAsRead($notification->data ?? [], $user->id);
            }
        } else {
            $user->unreadNotifications()->update(['read_at' => now()]);
            $this->markAllContactMessagesAsRead($user->id);
        }

        return back();
    }

    protected function markContactMessageAsRead(array $data, int $userId): void
    {
        if (! isset($data['contact_message_id'])) {
            return;
        }

        ContactMessage::query()
            ->where('id', $data['contact_message_id'])
            ->whereHas('listing', fn ($query) => $query->where('user_id', $userId))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    protected function markAllContactMessagesAsRead(int $userId): void
    {
        ContactMessage::query()
            ->whereNull('read_at')
            ->whereHas('listing', fn ($query) => $query->where('user_id', $userId))
            ->update(['read_at' => now()]);
    }

    public function destroy(Request $request, string $notificationId): RedirectResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->whereKey($notificationId)->firstOrFail();
        $notification->delete();

        return back()->with('success', 'Notification deleted.');
    }
}
