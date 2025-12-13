<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $listings = Listing::select('id', 'updated_at')->get();

        return response()->view('sitemap', [
            'listings' => $listings,
        ])->header('Content-Type', 'application/xml');
    }
}
