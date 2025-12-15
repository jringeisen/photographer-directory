<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarkNotificationsRequest;
use App\Http\Resources\NotificationResource;
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
            ->through(fn ($notification) => [
                'id' => $notification->id,
                'data' => $notification->data,
                'type' => $notification->type,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at->toIso8601String(),
            ]);

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
            $notifications->getCollection()->map(
                fn ($notification) => NotificationResource::make($notification)
                    ->withContactMessages($contactMessages)
                    ->toArray($request)
            )
        );

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(MarkNotificationsRequest $request): RedirectResponse
    {
        $data = $request->validated();

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
