<?php

namespace App\Services;

use App\Repositories\Interfaces\DashboardRepositoryInterface;

class DashboardService
{
    protected DashboardRepositoryInterface $dashboardRepository;

    public function __construct(DashboardRepositoryInterface $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    public function getStats(): array
    {
        return $this->dashboardRepository->getStats();
    }

    public function getOverview(): array
    {
        return $this->dashboardRepository->getOverview();
    }
}
