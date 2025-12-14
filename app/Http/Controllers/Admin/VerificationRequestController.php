<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VerificationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VerificationRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', VerificationRequest::class);

        $status = $request->string('status', 'pending')->toString();

        $requests = VerificationRequest::with('user')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($vr) => [
                'id' => $vr->id,
                'business_name' => $vr->business_name,
                'owner_name' => $vr->owner_name,
                'owner_email' => $vr->owner_email,
                'status' => $vr->status,
                'submitted_at' => optional($vr->submitted_at)->toIso8601String(),
                'user' => [
                    'id' => $vr->user_id,
                    'name' => $vr->user?->name,
                    'email' => $vr->user?->email,
                    'verification_status' => $vr->user?->verification_status,
                ],
            ]);

        return Inertia::render('Admin/Verification/Index', [
            'requests' => $requests,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function show(VerificationRequest $verificationRequest): Response
    {
        $this->authorize('view', $verificationRequest);

        $verificationRequest->load('user');

        return Inertia::render('Admin/Verification/Show', [
            'request' => [
                'id' => $verificationRequest->id,
                'business_name' => $verificationRequest->business_name,
                'legal_entity_type' => $verificationRequest->legal_entity_type,
                'registration_number' => $verificationRequest->registration_number,
                'registration_state' => $verificationRequest->registration_state,
                'business_address' => $verificationRequest->business_address,
                'owner_name' => $verificationRequest->owner_name,
                'owner_email' => $verificationRequest->owner_email,
                'owner_phone' => $verificationRequest->owner_phone,
                'website' => $verificationRequest->website,
                'bbb_profile_url' => $verificationRequest->bbb_profile_url,
                'status' => $verificationRequest->status,
                'admin_notes' => $verificationRequest->admin_notes,
                'submitted_at' => optional($verificationRequest->submitted_at)->toIso8601String(),
                'processed_at' => optional($verificationRequest->processed_at)->toIso8601String(),
                'user' => [
                    'id' => $verificationRequest->user_id,
                    'name' => $verificationRequest->user?->name,
                    'email' => $verificationRequest->user?->email,
                    'verification_status' => $verificationRequest->user?->verification_status,
                ],
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', VerificationRequest::class);

        $status = $request->string('status')->toString();
        $query = VerificationRequest::with('user')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest();

        $headers = [
            'Content-Type' => 'text/csv',
        ];

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID',
                'Business Name',
                'Owner Name',
                'Owner Email',
                'Status',
                'Submitted At',
                'Processed At',
                'Admin Notes',
            ]);

            $query->chunk(200, function ($chunk) use ($handle) {
                foreach ($chunk as $request) {
                    fputcsv($handle, [
                        $request->id,
                        $request->business_name,
                        $request->owner_name,
                        $request->owner_email,
                        $request->status,
                        optional($request->submitted_at)->toDateTimeString(),
                        optional($request->processed_at)->toDateTimeString(),
                        $request->admin_notes,
                    ]);
                }
            });

            fclose($handle);
        }, 'verification-requests.csv', $headers);
    }
}
