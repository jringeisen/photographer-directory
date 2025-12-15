<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\VerificationRequestResource;
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

        $status = VerificationStatus::tryFrom(
            $request->string('status', VerificationStatus::Pending->value)->toString()
        ) ?? VerificationStatus::Pending;

        $requests = VerificationRequest::with('user')
            ->when($status, fn ($q) => $q->where('status', $status->value))
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (VerificationRequest $vr) => VerificationRequestResource::make($vr)->toArray($request));

        return Inertia::render('Admin/Verification/Index', [
            'requests' => $requests,
            'filters' => [
                'status' => $status->value,
            ],
        ]);
    }

    public function show(VerificationRequest $verificationRequest): Response
    {
        $this->authorize('view', $verificationRequest);

        $verificationRequest->load('user');

        return Inertia::render('Admin/Verification/Show', [
            'request' => VerificationRequestResource::make($verificationRequest)->toArray($request),
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
                        $request->status->value,
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
