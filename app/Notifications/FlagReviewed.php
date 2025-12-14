<?php

namespace App\Notifications;

use App\Models\Flag;
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
        $listingName = $this->flag->listing?->company_name ?? 'listing';
        $statusLine = $this->flag->status === Flag::STATUS_RESOLVED
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
        return [
            'flag_id' => $this->flag->id,
            'listing_id' => $this->flag->listing_id,
            'listing_name' => $this->flag->listing?->company_name,
            'status' => $this->flag->status,
            'admin_notes' => $this->flag->admin_notes,
        ];
    }
}
