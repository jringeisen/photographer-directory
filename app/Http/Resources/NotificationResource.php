<?php

namespace App\Http\Resources;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class NotificationResource extends JsonResource
{
    protected ?Collection $contactMessages = null;

    /**
     * @param  array<string, mixed>  $resource
     */
    public function __construct($resource)
    {
        parent::__construct($resource);
    }

    public function withContactMessages(Collection $contactMessages): self
    {
        $this->contactMessages = $contactMessages;

        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $contact = $this->resolveContact($this->resource['data'] ?? []);

        return [
            'id' => $this->resource['id'],
            'data' => $this->resource['data'],
            'type' => $this->resource['type'],
            'read_at' => $this->resource['read_at'],
            'created_at' => $this->resource['created_at'],
            'message_full' => $contact?->message ?? $this->resource['data']['message'] ?? null,
            'listing' => $contact?->listing
                ? [
                    'id' => $contact->listing->id,
                    'name' => $contact->listing->company_name,
                ]
                : [
                    'id' => $this->resource['data']['listing_id'] ?? null,
                    'name' => $this->resource['data']['listing_name'] ?? null,
                ],
        ];
    }

    protected function resolveContact(array $data): ?ContactMessage
    {
        if (! $this->contactMessages || ! isset($data['contact_message_id'])) {
            return null;
        }

        return $this->contactMessages->get($data['contact_message_id']);
    }
}
