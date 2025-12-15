<?php

namespace App\Notifications;

use App\Enums\VerificationStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerificationRequestRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected $verificationRequest) {}

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
            ->subject('Verification request update')
            ->greeting('We’ve reviewed your verification')
            ->line('Your verification request has been rejected. Your listings are hidden until you resubmit and are approved.')
            ->line('Notes: '.$this->verificationRequest->admin_notes)
            ->action('Review and resubmit', route('verification.create'))
            ->line('Update your details and submit again when ready.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'status' => VerificationStatus::Rejected->value,
            'verification_request_id' => $this->verificationRequest->id,
            'admin_notes' => $this->verificationRequest->admin_notes,
        ];
    }
}
