<?php

namespace App\Mail;

use App\Models\Registration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;

class EventPromotedMail extends Mailable
{
    use Queueable;

    public Registration $registration;

    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
    }

    public function build(): self
    {
        return $this
            ->subject('You\'re In! A Spot Opened for "' . $this->registration->event->title . '"')
            ->view('emails.event-promoted');
    }
}
