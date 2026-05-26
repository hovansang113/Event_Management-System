<?php

namespace App\Repositories\Eloquent;

use App\Models\Event;
use App\Models\User;
use App\Models\Registration;
use App\Repositories\Interfaces\DashboardRepositoryInterface;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_events' => Event::count(),
            'total_registrations' => Registration::count(),
            'pending_events' => Event::where('status', 'Pending')->count(),
        ];
    }

    public function getOverview(): array
    {
        return [
            'stats' => [
                'total_users' => User::count(),
                'total_events' => Event::count(),
                'pending_approval' => Event::where('status', 'pending')->count(),
                'approved_events' => Event::where('status', 'published')->count(),
                'active_categories' => \App\Models\Category::where('is_active', true)->count(),
            ],
            'monthly_registrations' => Registration::selectRaw('COUNT(*) as count, MONTH(created_at) as month')
                ->groupBy('month')
                ->get(),
            'event_status_distribution' => Event::selectRaw('COUNT(*) as count, status')
                ->groupBy('status')
                ->get(),
        ];
    }
}
