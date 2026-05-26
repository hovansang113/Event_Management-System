<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_users' => $this['total_users'],
            'total_events' => $this['total_events'],
            'pending_approval' => $this['pending_approval'],
            'approved_events' => $this['approved_events'],
        ];
    }
}
