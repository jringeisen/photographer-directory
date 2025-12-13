<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\UploadSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/', [ListingController::class, 'index'])->name('home');
Route::get('/listings/{listing}', [ListingController::class, 'showPublic'])
    ->name('listings.public')
    ->where('listing', '[0-9]+');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Listing routes (show is public, handled outside auth middleware)
    Route::resource('listings', ListingController::class)->except(['index', 'show']);

    // Portfolio routes (nested under listings for index/create/store)
    Route::get('/listings/{listing}/portfolios', [PortfolioController::class, 'index'])
        ->name('listings.portfolios.index');
    Route::get('/listings/{listing}/portfolios/create', [PortfolioController::class, 'create'])
        ->name('listings.portfolios.create');
    Route::post('/listings/{listing}/portfolios', [PortfolioController::class, 'store'])
        ->name('listings.portfolios.store');

    // Portfolio standalone routes
    Route::get('/portfolios/{portfolio}', [PortfolioController::class, 'show'])
        ->name('portfolios.show');
    Route::get('/portfolios/{portfolio}/edit', [PortfolioController::class, 'edit'])
        ->name('portfolios.edit');
    Route::put('/portfolios/{portfolio}', [PortfolioController::class, 'update'])
        ->name('portfolios.update');
    Route::delete('/portfolios/{portfolio}', [PortfolioController::class, 'destroy'])
        ->name('portfolios.destroy');

    // Upload sessions for direct-to-cloud uploads
    Route::post('/uploads/sessions', [UploadSessionController::class, 'store'])
        ->name('uploads.sessions.store');
    Route::post('/uploads/sessions/{uploadSession}/complete', [UploadSessionController::class, 'complete'])
        ->name('uploads.sessions.complete');
    Route::delete('/uploads/sessions/{uploadSession}', [UploadSessionController::class, 'destroy'])
        ->name('uploads.sessions.destroy');
});
