<?php

namespace App\Http\Controllers;

use App\Enums\FlagStatus;
use App\Http\Requests\StoreFlagRequest;
use App\Models\Listing;
use App\Models\User;
use App\Notifications\ListingFlagged;
use Illuminate\Http\RedirectResponse;

class FlagController extends Controller
{
    public function store(StoreFlagRequest $request, Listing $listing): RedirectResponse
    {
        $listing->loadMissing('user');

        $categories = collect($request->input('categories', []))
            ->filter()
            ->values();
        $details = $request->string('reason')->trim()->toString();

        $reasonParts = [];
        if ($categories->isNotEmpty()) {
            $reasonParts[] = 'Categories: '.$categories->implode(', ');
        }
        if ($details !== '') {
            $reasonParts[] = 'Details: '.$details;
        }

        /** @var \App\Models\Flag $flag */
        $flag = $listing->flags()->create([
            'user_id' => optional($request->user())->id,
            'status' => FlagStatus::Pending,
            'reason' => implode(' | ', $reasonParts),
            'ip_address' => $request->ip(),
        ]);

        $owner = $listing->user;

        if ($owner instanceof User) {
            $owner->notify(new ListingFlagged($listing, $flag));
        }

        return redirect()->route('home')->with('success', 'Thank you. Your report has been submitted to our team.');
    }
}
