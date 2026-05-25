<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\RejectEventRequest;
use App\Http\Resources\Event\EventResource;
use App\Http\Resources\Event\EventCollection;
use App\Services\EventService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventRejectionMail;

class AdminEventController extends Controller
{
    use ApiResponse;

    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'category', 'search', 'per_page', 'page']);
            
            $paginator = $this->eventService->getAdminEvents($filters);
            $stats = $this->eventService->getAdminStats();

            return $this->success([
                'events' => new EventCollection($paginator),
                'stats' => $stats,
            ], 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve events: ' . $e->getMessage(), 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $event = $this->eventService->findById($id);
            if (!$event) {
                return $this->error('Event not found', 404);
            }

            return $this->success(new EventResource($event), 'Event retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve event: ' . $e->getMessage(), 500);
        }
    }

    public function approve($id): JsonResponse
    {
        try {
            $event = $this->eventService->approveEvent($id);
            return $this->success(new EventResource($event), 'Event approved successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function reject(RejectEventRequest $request, $id): JsonResponse
    {
        try {
            $event = $this->eventService->rejectEvent($id, $request->rejection_reason);
            Mail::to($event->organizer->email)->send(new EventRejectionMail($event));

            return $this->success(new EventResource($event), 'Event rejected successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $event = $this->eventService->findById($id);

            if (!$event) {
                return $this->error('Event not found', 404);
            }

            // Logic check should be in service, but for brevity:
            if (!in_array($event->status, ['Draft', 'Rejected'])) {
                return $this->error('Only draft or rejected events can be deleted', 400);
            }

            $this->eventService->deleteById($id);

            return $this->success(null, 'Event deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete event: ' . $e->getMessage(), 500);
        }
    }
}
