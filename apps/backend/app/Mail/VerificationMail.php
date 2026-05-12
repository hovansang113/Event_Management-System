<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationMail extends Mailable
{
    use SerializesModels;

    public User $user;
    public string $verifyUrl;

    public function __construct(User $user, string $token)
    {
        $this->user      = $user;
        $this->verifyUrl = url("/api/auth/verify-email?token={$token}");
    }

    public function build(): self
    {
        return $this
            ->subject('Xác minh địa chỉ email của bạn')
            ->view('emails.verify-email');
    }
}