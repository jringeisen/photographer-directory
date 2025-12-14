<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewFlagRequest;
use App\Models\Flag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlagController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status', Flag::STATUS_PENDING)->toString();

        $flags = Flag::with(['listing:id,company_name', 'user:id,name,email'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Flag $flag) => [
                'id' => $flag->id,
                'status' => $flag->status,
                'reason' => $flag->reason,
                'admin_notes' => $flag->admin_notes,
                'resolved_at' => optional($flag->resolved_at)->toIso8601String(),
                'created_at' => optional($flag->created_at)->toIso8601String(),
                'listing' => [
                    'id' => $flag->listing_id,
                    'company_name' => $flag->listing?->company_name,
                ],
                'reporter' => $flag->user
                    ? [
                        'id' => $flag->user->id,
                        'name' => $flag->user->name,
                        'email' => $flag->user->email,
                    ]
                    : null,
            ]);

        return Inertia::render('Admin/Flags/Index', [
            'flags' => $flags,
            'filters' => [
                'status' => $status,
            ],
            'statuses' => [
                Flag::STATUS_PENDING,
                Flag::STATUS_RESOLVED,
                Flag::STATUS_REJECTED,
            ],
        ]);
    }

    public function resolve(ReviewFlagRequest $request, Flag $flag): RedirectResponse
    {
        $flag->update([
            'status' => Flag::STATUS_RESOLVED,
            'admin_notes' => $request->input('admin_notes'),
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Flag marked as resolved.');
    }

    public function reject(ReviewFlagRequest $request, Flag $flag): RedirectResponse
    {
        $flag->update([
            'status' => Flag::STATUS_REJECTED,
            'admin_notes' => $request->input('admin_notes'),
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Flag rejected.');
    }
}
