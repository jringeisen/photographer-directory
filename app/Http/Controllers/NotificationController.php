<?php

namespace App\Http\Controllers;

use App\Http\Requests\MarkNotificationsRequest;
use App\Http\Resources\NotificationResource;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();

        if (! $user) {
            return Inertia::render('Notifications/Index', [
                'notifications' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 15,
                    'total' => 0,
                    'links' => [],
                ],
            ]);
        }

        $notifications = $user->notifications()->latest()->paginate(15);

        $contactMessageIds = collect($notifications->items())
            ->pluck('data.contact_message_id')
            ->filter()
            ->unique()
            ->all();

        $contactMessages = ContactMessage::with('listing')
            ->whereIn('id', $contactMessageIds)
            ->get()
            ->keyBy('id');

        $mapped = $notifications->getCollection()->map(
            fn (DatabaseNotification $notification): array => NotificationResource::make($notification)
                ->withContactMessages($contactMessages)
                ->toArray($request)
        );

        $notificationsData = $mapped->values()->all();

        return Inertia::render('Notifications/Index', [
            'notifications' => [
                'data' => $notificationsData,
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'links' => $notifications->linkCollection()->toArray(),
            ],
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
            ->whereHas('listing', fn (Builder $query) => $query->where('user_id', $userId))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    protected function markAllContactMessagesAsRead(int $userId): void
    {
        ContactMessage::query()
            ->whereNull('read_at')
            ->whereHas('listing', fn (Builder $query) => $query->where('user_id', $userId))
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
