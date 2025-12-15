<?php

namespace App\Notifications;

use App\Models\Flag;
use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ListingFlagged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Listing $listing,
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
        return (new MailMessage)
            ->subject("Your listing \"{$this->listing->company_name}\" was reported")
            ->line('A user reported your listing. It is hidden from the directory until the report is reviewed.')
            ->line("Reason: {$this->flag->reason}")
            ->action('Review on Dashboard', route('dashboard'))
            ->line('We will notify you once the report is resolved.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'listing_name' => $this->listing->company_name,
            'flag_id' => $this->flag->id,
            'reason' => $this->flag->reason,
            'status' => $this->flag->status->value,
        ];
    }
}
