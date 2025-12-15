<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationRequestResource extends JsonResource
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
            'business_name' => $this->business_name,
            'legal_entity_type' => $this->legal_entity_type,
            'registration_number' => $this->registration_number,
            'registration_state' => $this->registration_state,
            'business_address' => $this->business_address,
            'owner_name' => $this->owner_name,
            'owner_email' => $this->owner_email,
            'owner_phone' => $this->owner_phone,
            'website' => $this->website,
            'bbb_profile_url' => $this->bbb_profile_url,
            'status' => $this->status?->value ?? $this->status,
            'admin_notes' => $this->admin_notes,
            'submitted_at' => optional($this->submitted_at)->toIso8601String(),
            'processed_at' => optional($this->processed_at)->toIso8601String(),
            'user' => [
                'id' => $this->user_id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'verification_status' => $this->user?->verification_status?->value,
            ],
        ];
    }
}
