<?php

namespace App\Http\Resources;

use App\Models\Listing;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Portfolio $portfolio */
        $portfolio = $this->resource;
        $listing = $portfolio->listing;
        $lastViewedAt = $portfolio->last_viewed_at instanceof CarbonInterface
            ? $portfolio->last_viewed_at->toIso8601String()
            : null;

        return [
            'id' => $portfolio->getKey(),
            'listing_id' => $portfolio->listing_id,
            'name' => $portfolio->name,
            'description' => $portfolio->description,
            'views_count' => $portfolio->views_count,
            'last_viewed_at' => $lastViewedAt,
            'images' => $this->whenLoaded('images', fn () => $portfolio->images),
            'listing' => $this->whenLoaded('listing', fn () => $listing instanceof Listing ? [
                'id' => $listing->getKey(),
                'company_name' => $listing->company_name,
            ] : null),
        ];
    }
}
