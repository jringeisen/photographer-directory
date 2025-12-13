<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appUrl' => config('app.url'),
            'notifications' => fn () => $request->user()
                ? (function () use ($request) {
                    $notifications = $request->user()
                        ->notifications()
                        ->latest()
                        ->limit(10)
                        ->get();

                    return [
                        'unread_count' => $request->user()->unreadNotifications()->count(),
                        'items' => $notifications->map(fn ($notification) => [
                            'id' => $notification->id,
                            'data' => $notification->data,
                            'read_at' => $notification->read_at?->toIso8601String(),
                            'created_at' => $notification->created_at->toIso8601String(),
                            'type' => $notification->type,
                        ]),
                    ];
                })()
                : null,
        ];
    }
}
