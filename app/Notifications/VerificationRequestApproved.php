<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerificationRequestApproved extends Notification implements ShouldQueue
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
            ->subject('Your account has been verified')
            ->greeting('Congratulations!')
            ->line('Your verification request has been approved. Your listings now display a verified badge.')
            ->action('View dashboard', route('dashboard'))
            ->line('Thank you for keeping your business information up to date.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'status' => 'approved',
            'verification_request_id' => $this->verificationRequest->id,
        ];
    }
}
