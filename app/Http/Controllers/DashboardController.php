<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = auth()->user()->listings()
            ->with(['photographyTypes', 'images'])
            ->withCount(['images', 'portfolios']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%");
            });
        }

        $listings = $query->latest()->get();

        return Inertia::render('Dashboard', [
            'listings' => $listings,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
