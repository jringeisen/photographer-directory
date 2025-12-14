<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Portfolio;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $listings = Listing::select('id', 'updated_at')->get();
        $portfolios = Portfolio::select('id', 'updated_at')->get();

        return response()->view('sitemap', [
            'listings' => $listings,
            'portfolios' => $portfolios,
        ])->header('Content-Type', 'application/xml');
    }
}
