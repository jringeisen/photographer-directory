<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\UploadSession;
use App\Models\User;
use App\Services\UploadSessionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class UploadSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_start_upload_session_with_stubbed_service(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $session = UploadSession::factory()->make([
            'public_id' => (string) Str::ulid(),
            'part_size' => 5 * 1024 * 1024,
            'part_count' => 1,
        ]);

        $fakeService = new class($session) extends UploadSessionService
        {
            public function __construct(
                protected UploadSession $session
            ) {
                parent::__construct('s3');
            }

            public function createSession(User $user, string $filename, string $contentType, int $contentLength, string $purpose): array
            {
                $session = $this->session;
                $session->user_id = $user->id;
                $session->purpose = $purpose;
                $session->filename = $filename;
                $session->content_type = $contentType;
                $session->content_length = $contentLength;
                $session->storage_path = "uploads/tmp/{$user->id}/{$session->public_id}/{$filename}";
                $session->upload_id = 'fake-upload';
                $session->save();

                return [
                    $session,
                    [
                        [
                            'part_number' => 1,
                            'url' => 'https://example.test/upload-part',
                            'expires_at' => now()->addMinutes(30)->toIso8601String(),
                        ],
                    ],
                ];
            }
        };

        $this->app->instance(UploadSessionService::class, $fakeService);

        $response = $this->postJson('/uploads/sessions', [
            'filename' => 'photo.jpg',
            'content_type' => 'image/jpeg',
            'content_length' => 5_000_000,
            'purpose' => 'listing',
        ]);

        $response->assertCreated()->assertJsonFragment([
            'id' => $session->public_id,
            'part_count' => $session->part_count,
        ]);

        $this->assertDatabaseHas('upload_sessions', [
            'public_id' => $session->public_id,
            'purpose' => 'listing',
        ]);
    }

    public function test_listing_store_attaches_completed_uploads(): void
    {
        Storage::fake('s3');
        $user = User::factory()->create();
        $type = PhotographyType::factory()->create([
            'name' => 'Wedding',
            'slug' => 'wedding',
            'is_predefined' => true,
        ]);

        $session = UploadSession::factory()->completed()->create([
            'user_id' => $user->id,
            'purpose' => 'listing',
            'storage_path' => 'uploads/tmp/'.$user->id.'/temp/hero.jpg',
            'filename' => 'hero.jpg',
            'upload_id' => 'complete-id',
        ]);

        Storage::disk('s3')->put($session->storage_path, 'fake-image');

        $this->actingAs($user);

        $response = $this->post('/listings', [
            'company_name' => 'Test Studio',
            'city' => 'Denver',
            'state' => 'CO',
            'phone' => '123-456-7890',
            'description' => 'Great work',
            'photography_types' => [$type->id],
            'custom_types' => [],
            'uploaded_images' => [$session->public_id],
        ]);

        $response->assertRedirect();

        $listing = Listing::first();
        $this->assertNotNull($listing);
        $image = $listing->images()->first();

        $this->assertNotNull($image);
        $this->assertDatabaseHas('upload_sessions', [
            'public_id' => $session->public_id,
            'status' => UploadSession::STATUS_ATTACHED,
            'attached_to_id' => $listing->id,
            'attached_to_type' => Listing::class,
        ]);

        $this->assertTrue(Storage::disk('s3')->exists($image->path));
        $this->assertFalse(Storage::disk('s3')->exists($session->storage_path));
    }
}
