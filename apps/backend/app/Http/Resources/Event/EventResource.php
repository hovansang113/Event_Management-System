<?php

namespace App\Http\Resources\Event;

use App\Http\Resources\Category\CategoryResource;
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
            'location' => $this->location,
            'event_date' => $this->event_date instanceof \DateTimeInterface 
                ? $this->event_date->format('Y-m-d') 
                : $this->event_date,
            'event_time' => $this->event_time,
            'capacity' => $this->capacity,
            'status' => $this->status,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'organizer' => [
                'id' => $this->organizer_id,
                'name' => $this->organizer ? $this->organizer->name : null,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
