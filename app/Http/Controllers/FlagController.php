<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFlagRequest;
use App\Models\Flag;
use App\Models\Listing;
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

        $flag = $listing->flags()->create([
            'user_id' => optional($request->user())->id,
            'status' => Flag::STATUS_PENDING,
            'reason' => implode(' | ', $reasonParts),
            'ip_address' => $request->ip(),
        ]);

        if ($listing->user) {
            $listing->user->notify(new ListingFlagged($listing, $flag));
        }

        return redirect()->route('home')->with('success', 'Thank you. Your report has been submitted to our team.');
    }
}
