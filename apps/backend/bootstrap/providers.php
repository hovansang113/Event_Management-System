<?php

use App\Providers\AppServiceProvider;
use App\Providers\BrevoMailServiceProvider;
use App\Providers\RepositoryServiceProvider;

return [
    AppServiceProvider::class,
    RepositoryServiceProvider::class,
    BrevoMailServiceProvider::class,
];