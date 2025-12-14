<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use App\Models\Listing;
use App\Notifications\ContactMessageReceived;
use Illuminate\Http\RedirectResponse;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request, Listing $listing): RedirectResponse
    {
        $listing->loadMissing('user');

        if ($listing->isHiddenFromPublic()) {
            abort(404);
        }

        /** @var ContactMessage $message */
        $message = $listing->contactMessages()->create($request->validated());

        if ($listing->user) {
            $listing->user->notify(new ContactMessageReceived($listing, $message));
        }

        $listing->increment('contacts_count');

        return back()->with('success', 'Your message has been sent to the photographer.');
    }
}
