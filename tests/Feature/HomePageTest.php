<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('scout.driver', 'collection');
    }

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Home'));
    }

    public function test_home_page_displays_listings(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->for($user)->create();

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.id', $listing->id)
        );
    }

    public function test_home_page_displays_stats(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->count(3)->create();

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('stats')
            ->where('stats.totalPhotographers', 3)
        );
    }

    public function test_search_matches_company_name(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['company_name' => 'ABC Photography']);
        Listing::factory()->for($user)->create(['company_name' => 'XYZ Studios']);

        $response = $this->get('/?q=ABC');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.company_name', 'ABC Photography')
        );
    }

    public function test_search_matches_city_and_state_phrase(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['city' => 'New York', 'state' => 'NY']);
        Listing::factory()->for($user)->create(['city' => 'Los Angeles', 'state' => 'CA']);

        $response = $this->get('/?q=photographers in new york, ny');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.city', 'New York')
        );
    }

    public function test_search_matches_description_keywords(): void
    {
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
    }

    public function test_search_matches_photography_type(): void
    {
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
    }

    public function test_curated_listings_use_visitor_city_when_available(): void
    {
        $user = User::factory()->create();
        $austin = Listing::factory()->for($user)->create(['city' => 'Austin', 'state' => 'TX']);
        Listing::factory()->for($user)->create(['city' => 'Dallas', 'state' => 'TX']);

        $response = $this->withHeaders(['CF-IPCity' => 'Austin'])->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('curatedListings', fn ($list) => collect($list)->pluck('city')->contains('Austin'))
            ->where('curatedListings', fn ($list) => count($list) <= 4)
        );
    }

    public function test_listings_are_paginated(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->count(15)->create();

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 12)
            ->where('listings.total', 15)
            ->where('listings.per_page', 12)
        );
    }
}
