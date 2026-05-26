<?php

namespace App\Http\Resources\Registration;

use App\Http\Resources\Event\EventResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'position_in_waitlist' => $this->position_in_waitlist,
            'cancelled_at' => $this->cancelled_at,
            'created_at' => $this->created_at,
            'event' => new EventResource($this->event),
        ];
    }
}
