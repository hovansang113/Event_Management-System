<?php

namespace App\Http\Controllers\api\attendee;

use App\Http\Controllers\Controller;
use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\Event\EventResource;
use App\Http\Resources\Event\EventCollection;
use App\Services\EventService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\RegistrationService;
class EventController extends Controller
{
    use ApiResponse;

    public function __construct(
        private EventService $eventService,
        private RegistrationService $registrationService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'category',
            'search',
            'date_from',
            'date_to',
            'sort',
            'per_page',
            'page',
        ]);
        $paginator = $this->eventService->getAttendeeEvents($filters);

        return $this->success(new EventCollection($paginator), 'Events retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $event = $this->eventService->getAttendeeEventById($id);

        if (!$event) {
            return $this->error('Event not found', 404);
        }

        return $this->success(new EventResource($event), 'Event retrieved successfully');
    }

    public function categories(): JsonResponse
    {
        $categories = $this->eventService->getActiveCategories();
        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }

    public function register(int $id): JsonResponse
    {
        try {
            $registration = $this->registrationService->registerUser(auth()->id(), $id);
            $message = $registration->status === 'Waitlist' 
                ? 'Event is full. You have been added to the waitlist.' 
                : 'Registered successfully.';
            return $this->success($registration, $message);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function cancel(int $registrationId): JsonResponse
    {
        try {
            $this->registrationService->cancelRegistration($registrationId);
            return $this->success(null, 'Registration cancelled successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
