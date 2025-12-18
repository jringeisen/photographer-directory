<?php

namespace App\Http\Resources;

use App\Enums\FlagStatus;
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
        return array_merge(parent::toArray($request), [
            'reporting_status' => $this->reportingStatus(),
            'price' => [
                'starting_price_cents' => $this->starting_price_cents,
                'ending_price_cents' => $this->ending_price_cents,
                'starting_price' => $this->formatPriceValue($this->starting_price_cents),
                'ending_price' => $this->formatPriceValue($this->ending_price_cents),
                'label' => $this->priceLabel(),
            ],
            'highlights' => $this->whenLoaded(
                'highlights',
                fn () => $this->highlights->map(fn ($highlight) => [
                    'id' => $highlight->id,
                    'body' => $highlight->body,
                ])
            ),
        ]);
    }

    protected function reportingStatus(): string
    {
        return match ($this->latest_flag_status ?? null) {
            FlagStatus::Rejected->value => 'rejected',
            FlagStatus::Pending->value => 'pending',
            FlagStatus::Resolved->value => 'resolved',
            default => 'clear',
        };
    }

    protected function priceLabel(): ?string
    {
        if ($this->starting_price_cents === null && $this->ending_price_cents === null) {
            return null;
        }

        if ($this->starting_price_cents !== null && $this->ending_price_cents === null) {
            return 'Prices starting at '.$this->formatCents($this->starting_price_cents);
        }

        if ($this->starting_price_cents !== null && $this->ending_price_cents !== null) {
            return 'Packages between '.$this->formatCents($this->starting_price_cents).' and '.$this->formatCents($this->ending_price_cents);
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
