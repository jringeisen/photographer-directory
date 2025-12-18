<?php

namespace App\Notifications;

use App\Enums\FlagStatus;
use App\Models\Flag;
use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FlagReviewed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Flag $flag
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        /** @var Listing|null $listing */
        $listing = $this->flag->listing;
        $listingName = $listing ? $listing->company_name : 'listing';
        $statusLine = $this->flag->status === FlagStatus::Resolved
            ? 'Your report was accepted and the listing has been addressed.'
            : 'Your report was rejected.';

        return (new MailMessage)
            ->subject("Update on your report for {$listingName}")
            ->line($statusLine)
            ->lineIf(! empty($this->flag->admin_notes), "Admin notes: {$this->flag->admin_notes}")
            ->action('View listing', route('listings.public', $this->flag->listing_id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        /** @var Listing|null $listing */
        $listing = $this->flag->listing;

        return [
            'flag_id' => $this->flag->id,
            'listing_id' => $this->flag->listing_id,
            'listing_name' => $listing?->company_name,
            'status' => $this->flag->status->value,
            'admin_notes' => $this->flag->admin_notes,
        ];
    }
}
