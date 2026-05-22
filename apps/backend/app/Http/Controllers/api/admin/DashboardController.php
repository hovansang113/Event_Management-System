<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Event\EventResource;
use App\Traits\ApiResponse;
use App\Models\User;
use App\Models\Event;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function stats(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $totalEvents = Event::count();
            $pendingApproval = Event::where('status', 'Pending')->count();
            $approvedEvents = Event::where('status', 'Published')->count();

            return $this->success([
                'total_users' => $totalUsers,
                'total_events' => $totalEvents,
                'pending_approval' => $pendingApproval,
                'approved_events' => $approvedEvents,
            ], 'Dashboard statistics retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve dashboard statistics: ' . $e->getMessage(), 500);
        }
    }

    public function overview(): JsonResponse
    {
        try {
            // Stats
            $totalUsers = User::count();
            $totalEvents = Event::count();
            $pendingApproval = Event::where('status', 'Pending')->count();
            $approvedEvents = Event::where('status', 'Published')->count();
            $activeCategories = Category::where('is_active', true)->whereNull('deleted_at')->count();

            return $this->success([
                'stats' => [
                    'total_users' => $totalUsers,
                    'total_events' => $totalEvents,
                    'pending_approval' => $pendingApproval,
                    'approved_events' => $approvedEvents,
                    'active_categories' => $activeCategories,
                ],
            ], 'Dashboard overview retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve dashboard overview: ' . $e->getMessage(), 500);
        }
    }
}
