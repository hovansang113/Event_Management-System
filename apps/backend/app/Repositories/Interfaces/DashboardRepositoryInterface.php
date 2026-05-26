<?php

namespace App\Repositories\Interfaces;

interface DashboardRepositoryInterface
{
    public function getStats(): array;
    public function getOverview(): array;
}
