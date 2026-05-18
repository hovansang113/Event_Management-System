<?php

namespace App\Http\Resources\Event;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category_name' => $this->category ? $this->category->name : null,
            'event_date' => $this->event_date instanceof \DateTimeInterface 
                ? $this->event_date->format('Y-m-d') 
                : $this->event_date,
            'event_time' => $this->event_time,
            'location' => $this->location,
            'registrations_count' => $this->confirmed_count ?? $this->registrations()->where('status', 'Confirmed')->count(),
            'capacity' => $this->capacity,
            'waitlist_count' => $this->waitlist_count ?? $this->registrations()->where('status', 'Waitlist')->count(),
            'status' => $this->status,
            'description' => $this->description,
            'image' => $this->image,
            'rejection_reason' => $this->rejection_reason,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => $this->cancelled_at,
            'organizer' => [
                'id' => $this->organizer_id,
                'name' => $this->organizer ? $this->organizer->name : null,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
