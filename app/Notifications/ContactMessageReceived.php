<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ContactMessageReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Listing $listing,
        protected ContactMessage $contactMessage
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
        $preview = Str::limit($this->contactMessage->message, 200);

        return (new MailMessage)
            ->subject("New inquiry for {$this->listing->company_name}")
            ->view('mail.contact-message', [
                'listing' => $this->listing,
                'contact' => $this->contactMessage,
                'preview' => $preview,
                'dashboardUrl' => route('dashboard'),
            ]);
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
            'contact_message_id' => $this->contactMessage->id,
            'from_name' => $this->contactMessage->name,
            'from_email' => $this->contactMessage->email,
            'phone' => $this->contactMessage->phone,
            'message' => $this->contactMessage->message,
            'message_preview' => Str::limit($this->contactMessage->message, 240),
        ];
    }
}
