<?php

namespace App\Service;
use App\Repositories\EventRepository;

class EventService
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function createEvent(array $data)
    {
        $data['organizer_id'] = auth('api')->id();
        $data['status'] = 'Draft';

        $event = $this->eventRepository->create($data);
        
        return $event->load(['category', 'organizer']);
    }
}