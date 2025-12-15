<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'status' => $this->status?->value ?? $this->status,
            'reason' => $this->reason,
            'admin_notes' => $this->admin_notes,
            'resolved_at' => optional($this->resolved_at)->toIso8601String(),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'listing' => [
                'id' => $this->listing_id,
                'company_name' => $this->listing?->company_name,
            ],
            'reporter' => $this->user
                ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ]
                : null,
        ];
    }
}
