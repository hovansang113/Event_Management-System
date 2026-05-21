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
            'description' => $this->description,
            'image' => $this->image ? (str_starts_with($this->image, 'http') ? $this->image : url($this->image)) : null,
            'location' => $this->location,
            'date' => $this->event_date instanceof \DateTimeInterface 
                ? $this->event_date->format('Y-m-d') 
                : $this->event_date,
            'time' => $this->event_time,
            'capacity' => $this->capacity,
            'registered' => $this->confirmed_count ?? $this->registrations()->where('status', 'Confirmed')->count(),
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => $this->cancelled_at,
            'rating' => $this->rating ?? 0,
            'reviews' => $this->reviews_count ?? 0,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ],
            'organizer' => [
                'id' => $this->organizer?->id,
                'name' => $this->organizer?->name,
                'email' => $this->organizer?->email,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
