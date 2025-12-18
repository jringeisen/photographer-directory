<?php

use App\Models\Listing;
use App\Models\User;

test('home page loads successfully', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('Home'));
});

test('home page displays listings', function () {
    $user = User::factory()->create();
    $listing = Listing::factory()->for($user)->create();

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 1)
        ->where('listings.data.0.id', $listing->id)
    );
});

test('home page displays stats', function () {
    $user = User::factory()->create();
    Listing::factory()->for($user)->count(3)->create();

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('stats')
        ->where('stats.totalPhotographers', 3)
    );
});

test('search matches company name', function () {
    $user = User::factory()->create();
    Listing::factory()->for($user)->create(['company_name' => 'ABC Photography']);
    Listing::factory()->for($user)->create(['company_name' => 'XYZ Studios']);

    $response = $this->get('/?q=ABC');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 1)
        ->where('listings.data.0.company_name', 'ABC Photography')
    );
});

test('search matches city and state phrase', function () {
    $user = User::factory()->create();
    Listing::factory()->for($user)->create(['city' => 'New York', 'state' => 'NY']);
    Listing::factory()->for($user)->create(['city' => 'Los Angeles', 'state' => 'CA']);

    $response = $this->get('/?q=photographers in new york, ny');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 1)
        ->where('listings.data.0.city', 'New York')
    );
});

test('search matches description keywords', function () {
    $user = User::factory()->create();

    Listing::factory()->for($user)->create([
        'company_name' => 'Wedding Pro',
        'description' => 'Specializes in destination weddings in Florida',
        'city' => 'Miami',
        'state' => 'FL',
    ]);

    Listing::factory()->for($user)->create([
        'company_name' => 'Portrait Studio',
        'description' => 'Headshots and lifestyle sessions',
        'city' => 'Seattle',
        'state' => 'WA',
    ]);

    $response = $this->get('/?q=weddings in florida');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 1)
        ->where('listings.data.0.company_name', 'Wedding Pro')
    );
});

test('search matches photography type', function () {
    $user = User::factory()->create();

    $wedding = \App\Models\PhotographyType::factory()->create([
        'name' => 'Wedding',
        'slug' => 'wedding',
        'is_predefined' => true,
    ]);

    $portrait = \App\Models\PhotographyType::factory()->create([
        'name' => 'Portrait',
        'slug' => 'portrait',
        'is_predefined' => true,
    ]);

    $weddingListing = Listing::factory()->for($user)->create([
        'company_name' => 'Wedding Pros',
        'city' => 'Austin',
        'state' => 'TX',
    ]);
    $weddingListing->photographyTypes()->attach($wedding);

    $portraitListing = Listing::factory()->for($user)->create([
        'company_name' => 'Portrait Pros',
        'city' => 'Austin',
        'state' => 'TX',
    ]);
    $portraitListing->photographyTypes()->attach($portrait);

    $response = $this->get('/?q=wedding photographers');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 1)
        ->where('listings.data.0.company_name', 'Wedding Pros')
    );
});

test('curated listings use visitor city when available', function () {
    $user = User::factory()->create();
    $austin = Listing::factory()->for($user)->create(['city' => 'Austin', 'state' => 'TX']);
    Listing::factory()->for($user)->create(['city' => 'Dallas', 'state' => 'TX']);

    $response = $this->withHeaders(['CF-IPCity' => 'Austin'])->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->where('curatedListings', fn ($list) => collect($list)->pluck('city')->contains('Austin'))
        ->where('curatedListings', fn ($list) => count($list) <= 4)
    );
});

test('listings are paginated', function () {
    $user = User::factory()->create();
    Listing::factory()->for($user)->count(15)->create();

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 12)
        ->where('listings.total', 15)
        ->where('listings.per_page', 12)
    );
});

test('hidden listings do not reduce first page results', function () {
    $user = User::factory()->create();
    $visibleListings = Listing::factory()->for($user)->count(14)->create();
    $hiddenListings = Listing::factory()
        ->for($user)
        ->count(2)
        ->create(['created_at' => now()->addMinutes(5)]);

    $hiddenListings->each(function (Listing $listing) {
        \App\Models\Flag::factory()->for($listing)->create([
            'status' => \App\Enums\FlagStatus::Rejected->value,
        ]);
    });

    $response = $this->get('/');

    $response->assertInertia(fn ($page) => $page
        ->component('Home')
        ->has('listings.data', 12)
        ->where('listings.total', 14)
        ->where('listings.data', fn ($data) => collect($data)->pluck('id')->intersect($hiddenListings->pluck('id'))->isEmpty())
    );
});
