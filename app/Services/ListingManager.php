<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\PhotographyType;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListingManager
{
    public function __construct(
        protected ImageUploadService $imageService,
        protected ImageLimitValidator $imageLimitValidator,
        protected DatabaseManager $db
    ) {}

    public function create(Request $request, array $validated): Listing
    {
        $this->imageLimitValidator->assertWithinLimit($validated, 10);

        return $this->db->transaction(function () use ($validated, $request): Listing {
            [$startingPriceCents, $endingPriceCents] = $this->normalizePriceRange($validated);

            /** @var Listing $listing */
            $listing = $request->user()->listings()->create([
                'company_name' => $validated['company_name'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'description' => $validated['description'] ?? null,
                'starting_price_cents' => $startingPriceCents,
                'ending_price_cents' => $endingPriceCents,
            ]);

            $this->syncTypes($listing, $validated['photography_types'] ?? [], $validated['custom_types'] ?? [], $request);
            $this->syncHighlights($listing, $validated['highlights'] ?? []);

            if ($request->hasFile('images')) {
                $this->imageService->uploadListingImages($listing, $request->file('images'));
            }

            if (! empty($validated['uploaded_images'])) {
                $this->imageService->attachListingUploads($listing, $validated['uploaded_images']);
            }

            return $listing;
        });
    }

    public function update(Request $request, Listing $listing, array $validated): Listing
    {
        $existingCount = $listing->images()->count() - count($validated['remove_images'] ?? []);
        $this->imageLimitValidator->assertWithinLimit($validated, 10, max(0, $existingCount));

        return $this->db->transaction(function () use ($validated, $request, $listing): Listing {
            [$startingPriceCents, $endingPriceCents] = $this->normalizePriceRange($validated);

            $listing->update([
                'company_name' => $validated['company_name'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'description' => $validated['description'] ?? null,
                'starting_price_cents' => $startingPriceCents,
                'ending_price_cents' => $endingPriceCents,
            ]);

            $this->syncTypes($listing, $validated['photography_types'] ?? [], $validated['custom_types'] ?? [], $request);
            $this->syncHighlights($listing, $validated['highlights'] ?? []);

            if (! empty($validated['remove_images'])) {
                $this->imageService->removeListingImages($listing, $validated['remove_images']);
            }

            if ($request->hasFile('new_images')) {
                $this->imageService->uploadListingImages($listing, $request->file('new_images'));
            }

            if (! empty($validated['uploaded_images'])) {
                $this->imageService->attachListingUploads($listing, $validated['uploaded_images']);
            }

            return $listing;
        });
    }

    public function delete(Listing $listing): void
    {
        $this->imageService->deleteAllListingImages($listing);
        $listing->delete();
    }

    protected function syncTypes(Listing $listing, array $typeIds, array $customTypes, Request $request): void
    {
        foreach ($customTypes as $typeName) {
            $customType = PhotographyType::firstOrCreate(
                ['slug' => Str::slug($typeName), 'user_id' => $request->user()->id],
                ['name' => $typeName, 'is_predefined' => false]
            );
            $typeIds[] = $customType->id;
        }

        $listing->photographyTypes()->sync($typeIds);
    }

    /**
     * @param  array<int, string>  $highlights
     */
    protected function syncHighlights(Listing $listing, array $highlights): void
    {
        $prepared = collect($highlights)
            ->map(fn (string $highlight): string => trim($highlight))
            ->filter()
            ->values();

        $listing->highlights()->delete();

        foreach ($prepared as $index => $highlight) {
            $listing->highlights()->create([
                'body' => $highlight,
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * @return array{0: int|null, 1: int|null}
     */
    protected function normalizePriceRange(array $validated): array
    {
        $starting = $validated['starting_price'] ?? null;
        $ending = $validated['ending_price'] ?? null;

        return [
            $this->normalizePriceToCents($starting),
            $this->normalizePriceToCents($ending),
        ];
    }

    protected function normalizePriceToCents(float|int|string|null $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) round(((float) $value) * 100);
    }
}
