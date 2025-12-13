<?php

namespace App\Services;

use App\Jobs\ProcessUploadedImage;
use App\Models\Listing;
use App\Models\Portfolio;
use App\Models\UploadSession;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ImageUploadService
{
    public function uploadListingImages(Listing $listing, array $files): void
    {
        $currentMaxOrder = $listing->images()->max('order') ?? -1;

        foreach ($files as $index => $file) {
            /** @var UploadedFile $file */
            $path = $file->store("listings/{$listing->id}", 's3');

            $listing->images()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'order' => $currentMaxOrder + $index + 1,
            ]);
        }
    }

    public function attachListingUploads(Listing $listing, array $uploadIds): void
    {
        if (empty($uploadIds)) {
            return;
        }

        $sessions = $this->getAttachableSessions($uploadIds, $listing->user_id, 'listing');
        $currentMaxOrder = $listing->images()->max('order') ?? -1;

        foreach ($uploadIds as $index => $publicId) {
            /** @var UploadSession $session */
            $session = $sessions[$publicId];
            $finalPath = $this->moveToFinalPath(
                $session,
                "listings/{$listing->id}/".$this->finalFileName($session)
            );

            $listing->images()->create([
                'path' => $finalPath,
                'filename' => $session->filename,
                'order' => $currentMaxOrder + $index + 1,
            ]);

            $this->markAttached($session, Listing::class, $listing->id);
            ProcessUploadedImage::dispatch($session->disk, $finalPath);
        }
    }

    public function removeListingImages(Listing $listing, array $imageIds): void
    {
        $images = $listing->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            Storage::disk('s3')->delete($image->path);
            $image->delete();
        }
    }

    public function deleteAllListingImages(Listing $listing): void
    {
        foreach ($listing->images as $image) {
            Storage::disk('s3')->delete($image->path);
        }

        foreach ($listing->portfolios as $portfolio) {
            $this->deleteAllPortfolioImages($portfolio);
        }

        Storage::disk('s3')->deleteDirectory("listings/{$listing->id}");
    }

    public function uploadPortfolioImages(Portfolio $portfolio, array $files): void
    {
        $currentMaxOrder = $portfolio->images()->max('order') ?? -1;
        $listingId = $portfolio->listing_id;

        foreach ($files as $index => $file) {
            /** @var UploadedFile $file */
            $path = $file->store("listings/{$listingId}/portfolios/{$portfolio->id}", 's3');

            $portfolio->images()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'order' => $currentMaxOrder + $index + 1,
            ]);
        }
    }

    public function attachPortfolioUploads(Portfolio $portfolio, array $uploadIds): void
    {
        if (empty($uploadIds)) {
            return;
        }

        $sessions = $this->getAttachableSessions($uploadIds, $portfolio->listing->user_id, 'portfolio');
        $currentMaxOrder = $portfolio->images()->max('order') ?? -1;
        $listingId = $portfolio->listing_id;

        foreach ($uploadIds as $index => $publicId) {
            /** @var UploadSession $session */
            $session = $sessions[$publicId];
            $finalPath = $this->moveToFinalPath(
                $session,
                "listings/{$listingId}/portfolios/{$portfolio->id}/".$this->finalFileName($session)
            );

            $portfolio->images()->create([
                'path' => $finalPath,
                'filename' => $session->filename,
                'order' => $currentMaxOrder + $index + 1,
            ]);

            $this->markAttached($session, Portfolio::class, $portfolio->id);
            ProcessUploadedImage::dispatch($session->disk, $finalPath);
        }
    }

    public function removePortfolioImages(Portfolio $portfolio, array $imageIds): void
    {
        $images = $portfolio->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            Storage::disk('s3')->delete($image->path);
            $image->delete();
        }
    }

    public function deleteAllPortfolioImages(Portfolio $portfolio): void
    {
        foreach ($portfolio->images as $image) {
            Storage::disk('s3')->delete($image->path);
        }

        Storage::disk('s3')->deleteDirectory(
            "listings/{$portfolio->listing_id}/portfolios/{$portfolio->id}"
        );
    }

    public function updatePortfolioImageOrder(Portfolio $portfolio, array $order): void
    {
        foreach ($order as $position => $imageId) {
            $portfolio->images()
                ->where('id', $imageId)
                ->update(['order' => $position]);
        }
    }

    /**
     * @return array<string, UploadSession>
     */
    protected function getAttachableSessions(array $uploadIds, int $userId, string $purpose): array
    {
        $sessions = UploadSession::belongingToUser($userId)
            ->where('purpose', $purpose)
            ->whereIn('public_id', $uploadIds)
            ->get();

        $foundIds = $sessions->pluck('public_id')->all();
        $missing = array_diff($uploadIds, $foundIds);

        if (! empty($missing)) {
            throw ValidationException::withMessages([
                'uploaded_images' => 'Some uploads are missing or expired. Please re-upload and try again.',
            ]);
        }

        $unusable = $sessions->first(fn (UploadSession $session) => ! $session->isAttachable());

        if ($unusable) {
            throw ValidationException::withMessages([
                'uploaded_images' => 'One or more uploads have already been used.',
            ]);
        }

        return $sessions->keyBy('public_id')->all();
    }

    protected function moveToFinalPath(UploadSession $session, string $finalPath): string
    {
        $storage = Storage::disk($session->disk);

        $storage->copy($session->storage_path, $finalPath);
        $storage->delete($session->storage_path);

        $session->update([
            'storage_path' => $finalPath,
        ]);

        return $finalPath;
    }

    protected function markAttached(UploadSession $session, string $type, int $id): void
    {
        $session->update([
            'status' => UploadSession::STATUS_ATTACHED,
            'attached_to_type' => $type,
            'attached_to_id' => $id,
        ]);
    }

    protected function finalFileName(UploadSession $session): string
    {
        $extension = strtolower(pathinfo($session->filename, PATHINFO_EXTENSION)) ?: 'jpg';

        return Str::uuid().'.'.$extension;
    }
}
