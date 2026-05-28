<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $verifyUrl;

    public function __construct(User $user, string $token)
    {
        $this->user      = $user;
        $baseUrl         = rtrim(config('app.url'), '/');
        $this->verifyUrl = $baseUrl . "/api/auth/verify-email?token={$token}";
    }

    public function build(): self
    {
        return $this
            ->subject('Verify your email address')
            ->view('emails.verify-email');
    }
}