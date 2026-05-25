<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardOverviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'stats' => [
                'total_users' => $this['stats']['total_users'],
                'total_events' => $this['stats']['total_events'],
                'pending_approval' => $this['stats']['pending_approval'],
                'approved_events' => $this['stats']['approved_events'],
                'active_categories' => $this['stats']['active_categories'],
            ],
        ];
    }
}
