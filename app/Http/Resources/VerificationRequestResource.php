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
        /** @var \App\Models\VerificationRequest $verificationRequest */
        $verificationRequest = $this->resource;
        $user = $verificationRequest->user;
        $status = $verificationRequest->status;

        return [
            'id' => $verificationRequest->getKey(),
            'business_name' => $verificationRequest->business_name,
            'legal_entity_type' => $verificationRequest->legal_entity_type,
            'registration_number' => $verificationRequest->registration_number,
            'registration_state' => $verificationRequest->registration_state,
            'business_address' => $verificationRequest->business_address,
            'owner_name' => $verificationRequest->owner_name,
            'owner_email' => $verificationRequest->owner_email,
            'owner_phone' => $verificationRequest->owner_phone,
            'website' => $verificationRequest->website,
            'bbb_profile_url' => $verificationRequest->bbb_profile_url,
            'status' => $status instanceof \BackedEnum ? $status->value : $status,
            'admin_notes' => $verificationRequest->admin_notes,
            'submitted_at' => $verificationRequest->submitted_at?->toIso8601String(),
            'processed_at' => $verificationRequest->processed_at?->toIso8601String(),
            'user' => $user instanceof \App\Models\User ? [
                'id' => $verificationRequest->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'verification_status' => $user->verification_status instanceof \BackedEnum
                    ? $user->verification_status->value
                    : $user->verification_status,
            ] : [
                'id' => $verificationRequest->user_id,
                'name' => null,
                'email' => null,
                'verification_status' => null,
            ],
        ];
    }
}
