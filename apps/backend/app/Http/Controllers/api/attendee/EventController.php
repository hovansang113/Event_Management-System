<?php
namespace App\Http\Controllers\api\attendee;

use App\Http\Controllers\Controller;
use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\Event\EventResource;
use App\Service\EventService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponse;

    public function __construct(private EventService $eventService)
    {
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

        return $this->success([
            'data' => EventResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Events retrieved successfully');
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
}
