<?php

namespace App\Http\Resources;

use App\Enums\FlagStatus;
use App\Models\Flag;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlagResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Flag $flag */
        $flag = $this->resource;
        $listing = $flag->listing;
        $reporter = $flag->user;
        $status = $flag->status;

        return [
            'id' => $flag->getKey(),
            'status' => $status instanceof FlagStatus ? $status->value : $status,
            'reason' => $flag->reason,
            'admin_notes' => $flag->admin_notes,
            'resolved_at' => $flag->resolved_at?->toIso8601String(),
            'created_at' => $flag->created_at?->toIso8601String(),
            'listing' => [
                'id' => $flag->listing_id,
                'company_name' => $listing instanceof Listing ? $listing->company_name : null,
            ],
            'reporter' => $reporter instanceof User
                ? [
                    'id' => $reporter->id,
                    'name' => $reporter->name,
                    'email' => $reporter->email,
                ]
                : null,
        ];
    }
}
