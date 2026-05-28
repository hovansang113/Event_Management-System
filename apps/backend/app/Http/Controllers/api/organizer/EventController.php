<?php

namespace App\Http\Controllers\api\organizer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\CancelEventRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\Event\EventResource;
use App\Http\Resources\Event\EventCollection;
use App\Services\EventService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponse;

    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'sort', 'per_page', 'page']);
        $paginator = $this->eventService->getOrganizerDashboard($filters);
        
        return $this->success(new EventCollection($paginator), 'Events retrieved successfully');
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $event = $this->eventService->createEvent($request->validated());
        return $this->success(new EventResource($event), 'Event created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $event = $this->eventService->getEventById($id);
        
        if (!$event) {
            return $this->error('Event not found or unauthorized', 404);
        }
        
        return $this->success(new EventResource($event), 'Event retrieved successfully');
    }

    public function update(UpdateEventRequest $request, $id): JsonResponse
    {
        try {
            $event = $this->eventService->updateEvent($id, $request->validated());
            if (!$event) {
                return $this->error('Event not found or unauthorized', 404);
            }
            return $this->success(new EventResource($event), 'Event updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function submitForApproval($id): JsonResponse
    {
        $result = $this->eventService->submitForApproval($id);
        
        if (!$result) {
            return $this->error('Cannot submit this event for approval', 400);
        }
        
        return $this->success(null, 'Event submitted for approval successfully');
    }

    public function cancel(CancelEventRequest $request, $id): JsonResponse
    {
        try {
            $this->eventService->cancelEvent($id, $request->cancellation_reason);
            return $this->success(null, 'Event cancelled successfully');
        } catch (\App\Exceptions\ApiException $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 400);
        } catch (\Exception $e) {
            return $this->error('Failed to cancel event: ' . $e->getMessage(), 400);
        }
    }

    public function statistics(): JsonResponse
    {
        $stats = $this->eventService->getOrganizerStats();
        return $this->success($stats, 'Dashboard statistics retrieved successfully');
    }
}
