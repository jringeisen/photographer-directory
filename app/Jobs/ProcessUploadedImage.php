<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class ProcessUploadedImage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $disk,
        public string $path,
        public int $maxDimension = 6000
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $storage = Storage::disk($this->disk);
        $stream = $storage->readStream($this->path);

        if ($stream === false) {
            return;
        }

        $contents = stream_get_contents($stream);

        if ($contents === false) {
            fclose($stream);

            return;
        }

        fclose($stream);

        $metadata = @getimagesizefromstring($contents);

        if ($metadata === false) {
            return;
        }

        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            return;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        [$targetWidth, $targetHeight] = $this->resizeDimensions($width, $height);

        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagecopyresampled($target, $image, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        ob_start();
        $extension = strtolower(pathinfo($this->path, PATHINFO_EXTENSION));

        if ($extension === 'png') {
            imagepng($target);
        } elseif ($extension === 'webp' && function_exists('imagewebp')) {
            imagewebp($target, null, 85);
        } else {
            imagejpeg($target, null, 85);
        }

        $optimized = ob_get_clean();

        imagedestroy($image);
        imagedestroy($target);

        if ($optimized === false) {
            return;
        }

        $storage->put($this->path, $optimized);
    }

    protected function resizeDimensions(int $width, int $height): array
    {
        if ($width <= $this->maxDimension && $height <= $this->maxDimension) {
            return [$width, $height];
        }

        $ratio = min(
            $this->maxDimension / $width,
            $this->maxDimension / $height
        );

        $newWidth = (int) round($width * $ratio);
        $newHeight = (int) round($height * $ratio);

        return [$newWidth, $newHeight];
    }
}
