<?php

namespace App\Providers;

use Illuminate\Mail\MailManager;
use Illuminate\Support\ServiceProvider;

class BrevoMailServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->app->make(MailManager::class)->extend('brevo', function () {
            return new \Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoApiTransport(
                config('services.brevo.key')
            );
        });
    }
}