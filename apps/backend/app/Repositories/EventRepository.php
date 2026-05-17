<?php
namespace App\Repositories;
use App\Models\Event;

class EventRepository
{
    public function create(array $data): Event
    {
        return Event::create($data);
    }
}