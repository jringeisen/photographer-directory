<?php

namespace App\Http\Resources;

use App\Enums\FlagStatus;
use App\Models\Listing;
use App\Models\ListingHighlight;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Listing $listing */
        $listing = $this->resource;

        return array_merge(parent::toArray($request), [
            'reporting_status' => $this->reportingStatus($listing),
            'price' => [
                'starting_price_cents' => $listing->starting_price_cents,
                'ending_price_cents' => $listing->ending_price_cents,
                'starting_price' => $this->formatPriceValue($listing->starting_price_cents),
                'ending_price' => $this->formatPriceValue($listing->ending_price_cents),
                'label' => $this->priceLabel($listing),
            ],
            'highlights' => $this->whenLoaded(
                'highlights',
                fn () => $listing->highlights->map(function ($highlight) {
                    /** @var ListingHighlight $highlight */
                    return [
                        'id' => $highlight->id,
                        'body' => $highlight->body,
                    ];
                })
            ),
        ]);
    }

    protected function reportingStatus(Listing $listing): string
    {
        $latestFlagStatus = $listing->latest_flag_status ?? null;

        return match ($latestFlagStatus) {
            FlagStatus::Rejected->value => 'rejected',
            FlagStatus::Pending->value => 'pending',
            FlagStatus::Resolved->value => 'resolved',
            default => 'clear',
        };
    }

    protected function priceLabel(Listing $listing): ?string
    {
        if ($listing->starting_price_cents === null && $listing->ending_price_cents === null) {
            return null;
        }

        if ($listing->starting_price_cents !== null && $listing->ending_price_cents === null) {
            return 'Prices starting at '.$this->formatCents($listing->starting_price_cents);
        }

        if ($listing->starting_price_cents !== null && $listing->ending_price_cents !== null) {
            return 'Packages between '.$this->formatCents($listing->starting_price_cents).' and '.$this->formatCents($listing->ending_price_cents);
        }

        return null;
    }

    protected function formatCents(int $cents): string
    {
        return '$'.number_format($cents / 100, 2);
    }

    protected function formatPriceValue(?int $cents): ?string
    {
        if ($cents === null) {
            return null;
        }

        return number_format($cents / 100, 2, '.', '');
    }
}
