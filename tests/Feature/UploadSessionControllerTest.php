<?php

use App\Enums\UploadSessionStatus;
use App\Models\UploadSession;
use App\Models\User;
use App\Services\UploadSessionService;
use Illuminate\Support\Facades\Storage;
use Mockery\Expectation;

use function Pest\Laravel\actingAs;

afterEach(function () {
    \Mockery::close();
});

beforeEach(function () {
    Storage::fake('s3');
});

test('store returns session details', function () {
    $user = User::factory()->create();
    $session = UploadSession::factory()->make([
        'user_id' => $user->id,
        'disk' => 's3',
        'storage_path' => 'uploads/tmp/file.jpg',
        'status' => UploadSessionStatus::Pending,
    ]);
    $urls = [['part_number' => 1, 'url' => 'http://example.com', 'expires_at' => now()->toIso8601String()]];

    $service = \Mockery::mock(UploadSessionService::class);
    /** @var Expectation $expectation */
    $expectation = $service->shouldReceive('createSession');
    $expectation->once()->andReturn([$session, $urls]);
    app()->instance(UploadSessionService::class, $service);

    $response = actingAs($user)->postJson(route('uploads.sessions.store'), [
        'filename' => 'file.jpg',
        'content_type' => 'image/jpeg',
        'content_length' => 123,
        'purpose' => 'listing',
    ]);

    $response->assertCreated()->assertJsonFragment([
        'id' => $session->public_id,
        'part_count' => $session->part_count,
    ]);
});

test('complete finalizes pending session', function () {
    $user = User::factory()->create();
    $session = UploadSession::factory()->create([
        'user_id' => $user->id,
        'status' => UploadSessionStatus::Pending,
    ]);

    $service = \Mockery::mock(UploadSessionService::class);
    /** @var Expectation $expectation */
    $expectation = $service->shouldReceive('complete');
    $expectation->once()->andReturn(tap($session)->setAttribute('status', UploadSessionStatus::Completed));
    app()->instance(UploadSessionService::class, $service);

    $response = actingAs($user)->postJson(route('uploads.sessions.complete', $session), [
        'parts' => [
            ['part_number' => 1, 'etag' => 'abc'],
        ],
    ]);

    $response->assertOk()->assertJsonFragment([
        'id' => $session->public_id,
    ]);
});

test('destroy aborts pending session via service', function () {
    $user = User::factory()->create();
    $session = UploadSession::factory()->create([
        'user_id' => $user->id,
        'status' => UploadSessionStatus::Pending,
    ]);

    $service = \Mockery::mock(UploadSessionService::class);
    /** @var Expectation $expectation */
    $expectation = $service->shouldReceive('abort');
    $expectation->once();
    app()->instance(UploadSessionService::class, $service);

    $response = actingAs($user)->deleteJson(route('uploads.sessions.destroy', $session));

    $response->assertOk()->assertJson(['status' => 'aborted']);
});

test('destroy refuses attached session', function () {
    $user = User::factory()->create();
    $session = UploadSession::factory()->create([
        'user_id' => $user->id,
        'status' => UploadSessionStatus::Attached,
    ]);

    $response = actingAs($user)->deleteJson(route('uploads.sessions.destroy', $session));

    $response->assertStatus(400);
});
