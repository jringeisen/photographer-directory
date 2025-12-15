<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'name' => $this->name,
            'description' => $this->description,
            'views_count' => $this->views_count,
            'last_viewed_at' => optional($this->last_viewed_at)->toIso8601String(),
            'images' => $this->whenLoaded('images', fn () => $this->images),
            'listing' => $this->whenLoaded('listing', fn () => [
                'id' => $this->listing->id,
                'company_name' => $this->listing->company_name,
            ]),
        ];
    }
}
