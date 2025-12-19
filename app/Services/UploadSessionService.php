<?php

namespace App\Services;

use App\Enums\UploadSessionStatus;
use App\Models\UploadSession;
use App\Models\User;
use Aws\S3\S3Client;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use RuntimeException;

class UploadSessionService
{
    public function __construct(
        protected string $disk = 's3'
    ) {}

    public function createSession(User $user, string $filename, string $contentType, int $contentLength, string $purpose): array
    {
        $partSize = $this->determinePartSize($contentLength);
        $partCount = (int) ceil($contentLength / $partSize);
        $publicId = (string) Str::ulid();
        $directory = "uploads/tmp/{$user->id}/{$publicId}";

        [$safeFilename, $storagePath] = $this->buildStoragePath($directory, $filename);

        $uploadId = $this->startMultipartUpload($storagePath, $contentType, $safeFilename);

        $session = UploadSession::create([
            'public_id' => $publicId,
            'user_id' => $user->id,
            'disk' => $this->disk,
            'purpose' => $purpose,
            'directory' => $directory,
            'filename' => $filename,
            'content_type' => $contentType,
            'content_length' => $contentLength,
            'part_size' => $partSize,
            'part_count' => $partCount,
            'upload_id' => $uploadId,
            'storage_path' => $storagePath,
            'status' => UploadSessionStatus::Pending,
            'expires_at' => now()->addHour(),
            'parts' => [],
            'error' => null,
            'attached_to_type' => null,
            'attached_to_id' => null,
        ]);

        $urls = $this->presignedUrls($session);

        return [$session, $urls];
    }

    public function complete(UploadSession $session, array $parts): UploadSession
    {
        $client = $this->getClient();
        $bucket = $this->getBucket();

        $orderedParts = collect($parts)
            ->sortBy('part_number')
            ->values()
            ->map(fn (array $part): array => [
                'PartNumber' => $part['part_number'],
                'ETag' => $part['etag'],
            ])
            ->all();

        $client->completeMultipartUpload([
            'Bucket' => $bucket,
            'Key' => $session->storage_path,
            'UploadId' => $session->upload_id,
            'MultipartUpload' => [
                'Parts' => $orderedParts,
            ],
        ]);

        $session->update([
            'status' => UploadSessionStatus::Completed,
            'completed_at' => now(),
            'parts' => $orderedParts,
        ]);

        return $session;
    }

    public function abort(UploadSession $session): void
    {
        $client = $this->getClient();
        $bucket = $this->getBucket();

        $client->abortMultipartUpload([
            'Bucket' => $bucket,
            'Key' => $session->storage_path,
            'UploadId' => $session->upload_id,
        ]);

        Storage::disk($session->disk)->delete($session->storage_path);

        $session->update([
            'status' => UploadSessionStatus::Aborted,
            'error' => 'Upload aborted by user.',
        ]);
    }

    public function presignedUrls(UploadSession $session): array
    {
        $client = $this->getClient();
        $bucket = $this->getBucket();
        $expires = now()->addMinutes(30);

        $urls = [];

        for ($part = 1; $part <= $session->part_count; $part++) {
            $command = $client->getCommand('UploadPart', [
                'Bucket' => $bucket,
                'Key' => $session->storage_path,
                'UploadId' => $session->upload_id,
                'PartNumber' => $part,
            ]);

            $request = $client->createPresignedRequest($command, $expires);

            $urls[] = [
                'part_number' => $part,
                'url' => (string) $request->getUri(),
                'expires_at' => $expires->toIso8601String(),
            ];
        }

        return $urls;
    }

    protected function determinePartSize(int $contentLength): int
    {
        $minimum = 5 * 1024 * 1024; // 5 MB
        $target = 8 * 1024 * 1024; // 8 MB chunks for smoother progress

        return max($minimum, min($target, $contentLength));
    }

    protected function buildStoragePath(string $directory, string $filename): array
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION)) ?: 'jpg';
        $safeName = Str::uuid()->toString().'.'.$extension;
        $path = "{$directory}/{$safeName}";

        return [$safeName, $path];
    }

    protected function startMultipartUpload(string $path, string $contentType, string $safeFilename): string
    {
        $client = $this->getClient();
        $bucket = $this->getBucket();

        $result = $client->createMultipartUpload([
            'Bucket' => $bucket,
            'Key' => $path,
            'ContentType' => $contentType,
            'Metadata' => [
                'original-filename' => $safeFilename,
            ],
        ]);

        return $result['UploadId'];
    }

    protected function getFilesystem(): FilesystemAdapter
    {
        return Storage::disk($this->disk);
    }

    protected function getClient(): S3Client
    {
        $filesystem = $this->getFilesystem();

        if (method_exists($filesystem, 'getClient')) {
            return $filesystem->getClient();
        }

        $adapter = $filesystem->getAdapter();

        if ($adapter instanceof AwsS3V3Adapter && method_exists($adapter, 'getClient')) {
            return $adapter->getClient();
        }

        throw new RuntimeException('Unable to resolve S3 client for uploads.');
    }

    protected function getBucket(): string
    {
        $adapter = $this->getFilesystem()->getAdapter();

        if ($adapter instanceof AwsS3V3Adapter && method_exists($adapter, 'getBucket')) {
            return $adapter->getBucket();
        }

        $bucket = config("filesystems.disks.{$this->disk}.bucket");

        if (! $bucket) {
            throw new RuntimeException('S3 bucket is not configured.');
        }

        return $bucket;
    }
}
