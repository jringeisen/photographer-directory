<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\VerificationRequestResource;
use App\Models\VerificationRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
            ->when($status, fn (Builder $query) => $query->where('status', $status->value))
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (VerificationRequest $vr): array => VerificationRequestResource::make($vr)->toArray($request));

        return Inertia::render('Admin/Verification/Index', [
            'requests' => $requests,
            'filters' => [
                'status' => $status->value,
            ],
        ]);
    }

    public function show(Request $request, VerificationRequest $verificationRequest): Response
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
            ->when($status, fn (Builder $query) => $query->where('status', $status))
            ->latest();

        $headers = [
            'Content-Type' => 'text/csv',
        ];

        return response()->streamDownload(function () use ($query): void {
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

            $query->chunk(200, function (Collection $chunk) use ($handle): void {
                foreach ($chunk as $verificationRequest) {
                    fputcsv($handle, [
                        $verificationRequest->id,
                        $verificationRequest->business_name,
                        $verificationRequest->owner_name,
                        $verificationRequest->owner_email,
                        $verificationRequest->status->value,
                        optional($verificationRequest->submitted_at)->toDateTimeString(),
                        optional($verificationRequest->processed_at)->toDateTimeString(),
                        $verificationRequest->admin_notes,
                    ]);
                }
            });

            fclose($handle);
        }, 'verification-requests.csv', $headers);
    }
}
