<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFlagRequest;
use App\Models\Flag;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;

class FlagController extends Controller
{
    public function store(StoreFlagRequest $request, Listing $listing): RedirectResponse
    {
        $listing->flags()->create([
            'user_id' => $request->user()->id,
            'status' => Flag::STATUS_PENDING,
            'reason' => $request->string('reason')->toString(),
        ]);

        return back()->with('success', 'Thank you. Your report has been submitted to our team.');
    }
}
