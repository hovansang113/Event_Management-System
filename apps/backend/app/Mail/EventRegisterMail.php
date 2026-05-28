<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventRegisterMail extends Mailable
{
    use Queueable, SerializesModels;

    public Registration $registration;
    public string $userName;
    public string $eventTitle;
    public ?int $waitlistPosition;

    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
        $this->userName = $registration->user->name;
        $this->eventTitle = $registration->event->title;
        $this->waitlistPosition = $registration->position_in_waitlist;
    }

    public function build(): self
    {
        $subject = $this->registration->status === 'Waitlist'
            ? 'Waitlist Confirmation: ' . $this->eventTitle
            : 'Registration Confirmed: ' . $this->eventTitle;

        return $this->subject($subject)
                    ->view('emails.event-register');
    }
}
