<?php

namespace App\Http\Controllers;

use App\Enums\UserVerificationStatus;
use App\Enums\VerificationStatus;
use App\Http\Requests\StoreVerificationRequest;
use App\Models\VerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationRequestController extends Controller
{
    public function create(Request $request): Response
    {
        $this->authorize('create', VerificationRequest::class);

        $existing = VerificationRequest::where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return Inertia::render('Verification/Create', [
            'existingRequest' => $existing,
        ]);
    }

    public function store(StoreVerificationRequest $request): RedirectResponse
    {
        $this->authorize('create', VerificationRequest::class);

        $user = $request->user();

        $hasPending = VerificationRequest::where('user_id', $user->id)
            ->whereIn('status', [VerificationStatus::Pending->value, VerificationStatus::InReview->value])
            ->exists();

        if ($hasPending) {
            return redirect()->route('verification.create')
                ->with('error', 'You already have a verification request under review.');
        }

        VerificationRequest::create([
            ...$request->validated(),
            'user_id' => $user->id,
            'status' => VerificationStatus::Pending,
            'submitted_at' => now(),
        ]);

        $user->update([
            'verification_status' => UserVerificationStatus::InReview,
            'verification_notes' => null,
        ]);

        return redirect()->route('verification.create')->with('success', 'Verification submitted. We’ll review and notify you soon.');
    }
}
