<?php

namespace App\Http\Resources;

use App\Models\ContactMessage;
use App\Models\Listing;
use Carbon\CarbonInterface;
use DateTimeInterface;
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
        $data = $this->notificationData();
        $contact = $this->resolveContact($data);

        $listing = $contact?->listing;

        if ($listing && ! $listing instanceof Listing) {
            $listing = null;
        }

        $listingId = $listing ? $listing->getKey() : ($data['listing_id'] ?? null);
        $listingName = $listing ? $listing->company_name : ($data['listing_name'] ?? null);
        $message = $contact ? $contact->message : ($data['message'] ?? null);

        return [
            'id' => $this->value('id'),
            'data' => $data,
            'type' => $this->value('type'),
            'read_at' => $this->dateValue('read_at'),
            'created_at' => $this->dateValue('created_at'),
            'message_full' => $message,
            'listing' => [
                'id' => $listingId,
                'name' => $listingName,
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

    /**
     * @return array<string, mixed>
     */
    protected function notificationData(): array
    {
        $data = $this->value('data');

        return is_array($data) ? $data : [];
    }

    protected function value(string $key): mixed
    {
        if (is_array($this->resource)) {
            return $this->resource[$key] ?? null;
        }

        return $this->resource->{$key} ?? null;
    }

    protected function dateValue(string $key): ?string
    {
        $value = $this->value($key);

        if ($value instanceof CarbonInterface) {
            return $value->toIso8601String();
        }

        if ($value instanceof DateTimeInterface) {
            return $value->format(DATE_ATOM);
        }

        if ($value === null) {
            return null;
        }

        return (string) $value;
    }
}
