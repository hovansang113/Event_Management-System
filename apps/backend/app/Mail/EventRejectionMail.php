<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventRejectionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Event $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function build(): self
    {
        return $this->subject('Event Rejected: ' . $this->event->title)
                    ->view('emails.event-rejection');
    }
}