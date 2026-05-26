<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\DashboardRequest;
use App\Http\Resources\Dashboard\DashboardStatsResource;
use App\Http\Resources\Dashboard\DashboardOverviewResource;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function stats(DashboardRequest $request): JsonResponse
    {
        try {
            $stats = $this->dashboardService->getStats();
            return $this->success(
                new DashboardStatsResource($stats),
                'Dashboard statistics retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve dashboard statistics: ' . $e->getMessage(), 500);
        }
    }

    public function overview(DashboardRequest $request): JsonResponse
    {
        try {
            $overview = $this->dashboardService->getOverview();
            return $this->success(
                new DashboardOverviewResource($overview),
                'Dashboard overview retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve dashboard overview: ' . $e->getMessage(), 500);
        }
    }
}
