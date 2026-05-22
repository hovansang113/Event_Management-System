<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\RejectEventRequest;
use App\Http\Resources\Event\EventResource;
use App\Repositories\EventRepository;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminEventController extends Controller
{
    use ApiResponse;

    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function index(Request $request)
    {
        try {
            $filters = $request->only(['status', 'category', 'search', 'per_page', 'page']);
            $filters['per_page'] = min($filters['per_page'] ?? 10, 100);

            $paginator = $this->eventRepository->getAllForAdmin($filters);
            $stats = $this->eventRepository->getAdminStatistics();

            return $this->success([
                'data' => EventResource::collection($paginator->items()),
                'stats' => $stats,
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ], 'Events retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve events: ' . $e->getMessage(), 500);
        }
    }

    public function show($id){
        try {
            $event = $this->eventRepository->findById($id);
            if (!$event) {
                return $this->error('Event not found', 404);
            }

            return $this->success(new EventResource($event), 'Event retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve event: ' . $e->getMessage(), 500);
        }
    }

    public function approve($id){
        try {
            $event = $this->eventRepository->findById($id);
            if (!$event) {
                return $this->error('Event not found', 404);
            }

            if ($event->status !== 'Pending') {
                return $this->error('Only pending events can be approved', 400);
            }

            $this->eventRepository->update($id, ['status' => 'Published']);
            $event->refresh();

            // TODO: Send email to organizer

            return $this->success(new EventResource($event), 'Event approved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to approve event: ' . $e->getMessage(), 500);
        }
    }

    public function reject(RejectEventRequest $request, $id)
    {
        try {
            $event = $this->eventRepository->findById($id);

            if (!$event) {
                return $this->error('Event not found', 404);
            }

            if ($event->status !== 'Pending') {
                return $this->error('Only pending events can be rejected', 400);
            }

            $this->eventRepository->update($id, [
                'status' => 'Rejected',
                'rejection_reason' => $request->rejection_reason,
            ]);
            $event->refresh();

            // TODO: Send email to organizer with reason

            return $this->success(new EventResource($event), 'Event rejected successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to reject event: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $event = $this->eventRepository->findById($id);

            if (!$event) {
                return $this->error('Event not found', 404);
            }

            if (!in_array($event->status, ['Draft', 'Rejected'])) {
                return $this->error('Only draft or rejected events can be deleted', 400);
            }

            $event->delete();

            return $this->success(null, 'Event deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete event: ' . $e->getMessage(), 500);
        }
    }
}
