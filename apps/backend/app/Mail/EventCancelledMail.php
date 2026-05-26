<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;

class EventCancelledMail extends Mailable{
    use Queueable, SerializesModels;

    public $event;
    public function __construct(Event $event){
        $this->event = $event;
    }

    public function build(){
        return $this->subject('Event Cancelled: '. $this->event->title)
                    ->view('emails.event-cancelled');
    }
}