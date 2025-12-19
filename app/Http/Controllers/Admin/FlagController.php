<?php

namespace App\Http\Controllers\Admin;

use App\Enums\FlagStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewFlagRequest;
use App\Http\Resources\FlagResource;
use App\Models\Flag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlagController extends Controller
{
    public function index(Request $request): Response
    {
        $status = FlagStatus::tryFrom(
            $request->string('status', FlagStatus::Pending->value)->toString()
        ) ?? FlagStatus::Pending;

        $flags = Flag::with(['listing:id,company_name', 'user:id,name,email'])
            ->when($status, fn (Builder $query) => $query->where('status', $status->value))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Flag $flag): array => FlagResource::make($flag)->toArray($request));

        return Inertia::render('Admin/Flags/Index', [
            'flags' => $flags,
            'filters' => [
                'status' => $status->value,
            ],
            'statuses' => collect(FlagStatus::cases())->map->value->all(),
        ]);
    }

    public function resolve(ReviewFlagRequest $request, Flag $flag): RedirectResponse
    {
        $flag->update([
            'status' => FlagStatus::Resolved,
            'admin_notes' => $request->input('admin_notes'),
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Flag marked as resolved.');
    }

    public function reject(ReviewFlagRequest $request, Flag $flag): RedirectResponse
    {
        $flag->update([
            'status' => FlagStatus::Rejected,
            'admin_notes' => $request->input('admin_notes'),
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Flag rejected.');
    }
}
