<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomePageTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_search_filters_listings_by_company_name(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['company_name' => 'ABC Photography']);
        Listing::factory()->for($user)->create(['company_name' => 'XYZ Studios']);

        $response = $this->get('/?search=ABC');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.company_name', 'ABC Photography')
        );
    }

    public function test_search_filters_listings_by_city(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['city' => 'New York', 'state' => 'NY']);
        Listing::factory()->for($user)->create(['city' => 'Los Angeles', 'state' => 'CA']);

        $response = $this->get('/?search=New York');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.city', 'New York')
        );
    }

    public function test_filters_listings_by_photography_type(): void
    {
        $user = User::factory()->create();

        $wedding = PhotographyType::factory()->create([
            'name' => 'Wedding',
            'slug' => 'wedding',
            'is_predefined' => true,
        ]);

        $portrait = PhotographyType::factory()->create([
            'name' => 'Portrait',
            'slug' => 'portrait',
            'is_predefined' => true,
        ]);

        $weddingListing = Listing::factory()->for($user)->create(['company_name' => 'Wedding Pro']);
        $weddingListing->photographyTypes()->attach($wedding);

        $portraitListing = Listing::factory()->for($user)->create(['company_name' => 'Portrait Studio']);
        $portraitListing->photographyTypes()->attach($portrait);

        $response = $this->get('/?type='.$wedding->id);

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.company_name', 'Wedding Pro')
        );
    }

    public function test_filters_listings_by_location(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['city' => 'Miami', 'state' => 'FL']);
        Listing::factory()->for($user)->create(['city' => 'Seattle', 'state' => 'WA']);

        $response = $this->get('/?location=Miami');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.city', 'Miami')
        );
    }

    public function test_home_page_returns_photography_types_for_filter(): void
    {
        PhotographyType::factory()->create([
            'name' => 'Wedding',
            'slug' => 'wedding',
            'is_predefined' => true,
        ]);

        PhotographyType::factory()->create([
            'name' => 'Portrait',
            'slug' => 'portrait',
            'is_predefined' => true,
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('photographyTypes', 2)
        );
    }

    public function test_home_page_returns_unique_locations(): void
    {
        $user = User::factory()->create();
        Listing::factory()->for($user)->create(['city' => 'Miami', 'state' => 'FL']);
        Listing::factory()->for($user)->create(['city' => 'Seattle', 'state' => 'WA']);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('locations', 2)
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

    public function test_combined_filters_work_together(): void
    {
        $user = User::factory()->create();

        $wedding = PhotographyType::factory()->create([
            'name' => 'Wedding',
            'slug' => 'wedding',
            'is_predefined' => true,
        ]);

        $targetListing = Listing::factory()->for($user)->create([
            'company_name' => 'Perfect Match Photography',
            'city' => 'Miami',
            'state' => 'FL',
        ]);
        $targetListing->photographyTypes()->attach($wedding);

        $otherListing = Listing::factory()->for($user)->create([
            'company_name' => 'Other Studio',
            'city' => 'Seattle',
            'state' => 'WA',
        ]);
        $otherListing->photographyTypes()->attach($wedding);

        $response = $this->get('/?search=Perfect&type='.$wedding->id.'&location=Miami');

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('listings.data', 1)
            ->where('listings.data.0.company_name', 'Perfect Match Photography')
        );
    }
}
