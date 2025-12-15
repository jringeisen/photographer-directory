<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewVerificationRequest;
use App\Models\User;
use App\Models\VerificationRequest;
use App\Notifications\VerificationRequestApproved;
use App\Notifications\VerificationRequestRejected;
use Illuminate\Http\RedirectResponse;

class VerificationDecisionController extends Controller
{
    public function approve(ReviewVerificationRequest $request, VerificationRequest $verificationRequest): RedirectResponse
    {
        $this->authorize('update', $verificationRequest);

        $verificationRequest->update([
            'status' => VerificationStatus::Approved,
            'admin_notes' => $request->input('admin_notes'),
            'processed_at' => now(),
        ]);

        /** @var User $user */
        $user = $verificationRequest->user;

        $user->update([
            'verification_status' => UserVerificationStatus::Verified,
            'verified_at' => now(),
            'verification_notes' => $request->input('admin_notes'),
        ]);

        $user->notify(new VerificationRequestApproved($verificationRequest));

        return back()->with('success', 'Verification approved. User marked as verified.');
    }

    public function reject(ReviewVerificationRequest $request, VerificationRequest $verificationRequest): RedirectResponse
    {
        $this->authorize('update', $verificationRequest);

        $verificationRequest->update([
            'status' => VerificationStatus::Rejected,
            'admin_notes' => $request->input('admin_notes'),
            'processed_at' => now(),
        ]);

        /** @var User $user */
        $user = $verificationRequest->user;

        $user->update([
            'verification_status' => UserVerificationStatus::Rejected,
            'verification_notes' => $request->input('admin_notes'),
        ]);

        $user->notify(new VerificationRequestRejected($verificationRequest));

        return back()->with('success', 'Verification rejected. Listings will be hidden.');
    }
}
