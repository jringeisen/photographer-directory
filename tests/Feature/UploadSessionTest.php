<?php

use App\Enums\UploadSessionStatus;
use App\Models\Listing;
use App\Models\PhotographyType;
use App\Models\UploadSession;
use App\Models\User;
use App\Services\UploadSessionService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\post;
use function Pest\Laravel\postJson;

test('user can start upload session with stubbed service', function () {
    $user = User::factory()->create();
    actingAs($user);

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
            $session->user_id = $user->getKey();
            $session->purpose = $purpose;
            $session->filename = $filename;
            $session->content_type = $contentType;
            $session->content_length = $contentLength;
            $session->storage_path = "uploads/tmp/{$user->getKey()}/{$session->public_id}/{$filename}";
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

    app()->instance(UploadSessionService::class, $fakeService);

    $response = postJson('/uploads/sessions', [
        'filename' => 'photo.jpg',
        'content_type' => 'image/jpeg',
        'content_length' => 5_000_000,
        'purpose' => 'listing',
    ]);

    $response->assertCreated()->assertJsonFragment([
        'id' => $session->public_id,
        'part_count' => $session->part_count,
    ]);

    assertDatabaseHas('upload_sessions', [
        'public_id' => $session->public_id,
        'purpose' => 'listing',
    ]);
});

test('listing store attaches completed uploads', function () {
    Storage::fake('s3');
    $user = User::factory()->create();
    $type = PhotographyType::factory()->create([
        'name' => 'Wedding',
        'slug' => 'wedding',
        'is_predefined' => true,
    ]);

    $session = UploadSession::factory()->completed()->create([
        'user_id' => $user->getKey(),
        'purpose' => 'listing',
        'storage_path' => 'uploads/tmp/'.$user->getKey().'/temp/hero.jpg',
        'filename' => 'hero.jpg',
        'upload_id' => 'complete-id',
    ]);

    Storage::disk('s3')->put($session->storage_path, 'fake-image');

    actingAs($user);

    $response = post('/listings', [
        'company_name' => 'Test Studio',
        'city' => 'Denver',
        'state' => 'CO',
        'phone' => '123-456-7890',
        'description' => 'Great work',
        'photography_types' => [$type->getKey()],
        'custom_types' => [],
        'uploaded_images' => [$session->public_id],
    ]);

    $response->assertRedirect();

    $listing = Listing::first();
    expect($listing)->not->toBeNull();
    $image = $listing->images()->first();

    expect($image)->not->toBeNull();
    assertDatabaseHas('upload_sessions', [
        'public_id' => $session->public_id,
        'status' => UploadSessionStatus::Attached->value,
        'attached_to_id' => $listing->getKey(),
        'attached_to_type' => Listing::class,
    ]);

    expect(Storage::disk('s3')->exists($image?->getAttribute('path')))->toBeTrue()
        ->and(Storage::disk('s3')->exists($session->storage_path))->toBeFalse();
});
