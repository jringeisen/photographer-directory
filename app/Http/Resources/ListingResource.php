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
}
