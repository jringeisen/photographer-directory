<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ImpersonationController extends Controller
{
    public function start(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->is_admin, 403);

        if ($request->user()->id === $user->id) {
            return back()->with('error', 'You are already signed in as this user.');
        }

        $request->session()->put('impersonator_id', $request->user()->id);
        $request->session()->put('impersonated_at', now()->toIso8601String());

        auth()->login($user);

        return redirect()->route('dashboard')->with('success', "You are now impersonating {$user->name}.");
    }

    public function stop(Request $request): RedirectResponse
    {
        $impersonatorId = $request->session()->pull('impersonator_id');
        $request->session()->forget('impersonated_at');

        if (! $impersonatorId) {
            return redirect()->route('dashboard');
        }

        $admin = User::find($impersonatorId);

        if ($admin) {
            auth()->login($admin);
        }

        return redirect()->route('dashboard')->with('success', 'Impersonation ended.');
    }
}
