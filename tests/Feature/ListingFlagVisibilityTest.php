<?php

namespace Tests\Feature;

use App\Enums\FlagStatus;
use App\Models\Listing;
use App\Models\User;
use App\Notifications\ListingFlagged;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ListingFlagVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_flagged_listing_is_hidden_from_homepage(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        foreach (range(1, 5) as $i) {
            $listing->flags()->create([
                'user_id' => null,
                'status' => FlagStatus::Pending->value,
                'reason' => 'Inaccurate information',
                'created_at' => now(),
            ]);
        }

        $response = $this->get(route('home'));

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
        );
    }

    public function test_rejected_flagged_listing_is_hidden_from_homepage(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Rejected->value,
            'reason' => 'Content rejected',
        ]);

        $response = $this->get(route('home'));

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('listings.data', fn ($list) => collect($list)->pluck('id')->doesntContain($listing->id))
        );
    }

    public function test_resolved_flagged_listing_is_visible_again(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Resolved->value,
            'reason' => 'Issue fixed',
        ]);

        $response = $this->get(route('home'));

        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('listings.data', fn ($list) => collect($list)->pluck('id')->contains($listing->id))
        );
    }

    public function test_pending_flagged_listing_cannot_be_viewed_publicly(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        foreach (range(1, 5) as $i) {
            $listing->flags()->create([
                'user_id' => null,
                'status' => FlagStatus::Pending->value,
                'reason' => 'Spam',
                'created_at' => now(),
            ]);
        }

        $this->get(route('listings.public', $listing))->assertNotFound();
    }

    public function test_rejected_flagged_listing_cannot_be_viewed_publicly(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Rejected->value,
            'reason' => 'Rejected listing',
        ]);

        $this->get(route('listings.public', $listing))->assertNotFound();
    }

    public function test_dashboard_shows_rejected_reporting_status(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->for($user)->create();
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Rejected->value,
            'reason' => 'Rejected listing',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('listings', fn ($listings) => collect($listings)->firstWhere('id', $listing->id)['reporting_status'] === 'rejected')
        );
    }

    public function test_pending_flagged_listing_cannot_receive_contact_messages(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();
        foreach (range(1, 5) as $i) {
            $listing->flags()->create([
                'user_id' => null,
                'status' => FlagStatus::Pending->value,
                'reason' => 'Suspicious activity',
                'created_at' => now(),
            ]);
        }

        $response = $this->post(route('listings.contact', $listing), [
            'name' => 'Visitor',
            'email' => 'visitor@example.com',
            'message' => 'Hello there',
        ]);

        $response->assertNotFound();
        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_admin_can_view_flagged_listing_with_banner_data(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $listing = Listing::factory()->for(User::factory())->create();
        $listing->flags()->create([
            'user_id' => null,
            'status' => FlagStatus::Pending->value,
            'reason' => 'Review needed',
        ]);

        $response = $this->actingAs($admin)->get(route('listings.public', $listing));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Listings/PublicShow')
            ->where('listing.pending_flags_count', 1)
            ->where('canBypassHidden', true)
        );
    }

    public function test_owner_is_notified_when_listing_is_flagged(): void
    {
        Notification::fake();

        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->post(route('listings.flag', $listing), [
            'reason' => 'Concerning content',
            'categories' => ['spam'],
        ])->assertRedirect();

        Notification::assertSentTo($owner, ListingFlagged::class);
    }

    public function test_guest_can_report_listing(): void
    {
        $owner = User::factory()->create();
        $listing = Listing::factory()->for($owner)->create();

        $this->post(route('listings.flag', $listing), [
            'reason' => 'Problematic listing',
            'categories' => ['inaccurate'],
        ])->assertRedirect();

        $this->assertDatabaseHas('flags', [
            'listing_id' => $listing->id,
            'ip_address' => '127.0.0.1',
        ]);
    }

    public function test_ip_rate_limit_blocks_abuse(): void
    {
        $listing = Listing::factory()->for(User::factory())->create();

        foreach (range(1, 5) as $i) {
            $this->post(route('listings.flag', $listing), [
                'reason' => "Abuse attempt {$i}",
                'categories' => ['spam'],
            ])->assertRedirect();
        }

        $response = $this->post(route('listings.flag', $listing), [
            'reason' => 'Too many',
            'categories' => ['spam'],
        ]);

        $response->assertSessionHasErrors('reason');
        $this->assertDatabaseCount('flags', 5);
    }
}
