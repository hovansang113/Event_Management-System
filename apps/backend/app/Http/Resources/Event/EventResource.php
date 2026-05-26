<?php

namespace App\Http\Resources\Event;

use App\Http\Resources\Review\ReviewResource;
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
            'registered' => $this->getAttributeValue('confirmed_count') ?? $this->registrations()->where('status', 'Confirmed')->count(),
            'waitlist_count' => $this->getAttributeValue('waitlist_count') ?? $this->registrations()->where('status', 'Waitlist')->count(),
            'registrations' => $this->registrations->where('user_id', auth()->id())->values(),
            'reviews_list' => $this->relationLoaded('reviews')
                ? ReviewResource::collection($this->reviews->sortByDesc('created_at'))
                : [],
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => $this->cancelled_at,
            'rating' => $this->relationLoaded('reviews')
                ? round($this->reviews->avg('rating'), 1)
                : (float) ($this->rating ?? 0),
            'reviews' => $this->relationLoaded('reviews') ? $this->reviews->count() : (int) ($this->reviews_count ?? 0),
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
