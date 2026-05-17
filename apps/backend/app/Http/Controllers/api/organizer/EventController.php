<?php

namespace App\Http\Controllers\api\organizer;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Resources\Event\EventResource;
use App\Service\EventService;
use App\Traits\ApiResponse;

class EventController extends Controller{
    use ApiResponse;
    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function store(StoreEventRequest $request){
        $event = $this->eventService->createEvent($request->validated());
        return $this->success(new EventResource($event), 'Event created successfully', 201);
    }
}


