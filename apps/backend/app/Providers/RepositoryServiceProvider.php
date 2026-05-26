<?php

namespace App\Providers;

use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Eloquent\EventRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Eloquent\RegistrationRepository;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\RegistrationRepositoryInterface;
use App\Repositories\Eloquent\ReviewRepository;
use App\Repositories\Interfaces\ReviewRepositoryInterface;
use Illuminate\Support\ServiceProvider;

use App\Repositories\Eloquent\DashboardRepository;
use App\Repositories\Interfaces\DashboardRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(EventRepositoryInterface::class, EventRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(DashboardRepositoryInterface::class, DashboardRepository::class);
        $this->app->bind(RegistrationRepositoryInterface::class, RegistrationRepository::class);
        $this->app->bind(ReviewRepositoryInterface::class, ReviewRepository::class);
    }
}
