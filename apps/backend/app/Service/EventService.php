<?php

namespace App\Service;

use App\Repositories\EventRepository;
use Illuminate\Support\Facades\Storage;

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
        $data['status'] = $data['status'] ?? 'Draft';

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['image']->store('events', 'public');
            $data['image'] = Storage::url($path);
        }

        $event = $this->eventRepository->create($data);
        
        return $event->load(['category', 'organizer']);
    }

    public function getOrganizerDashboard(array $filters)
    {
        $organizerId = auth('api')->id();
        return $this->eventRepository->getOrganizerEvents($organizerId, $filters);
    }

    public function getOrganizerStats()
    {
        $organizerId = auth('api')->id();
        return $this->eventRepository->getOrganizerStatistics($organizerId);
    }

    public function getEventById($id)
    {
        $event = $this->eventRepository->findById($id);
        
        if (!$event || $event->organizer_id !== auth('api')->id()) {
            return null;
        }

        return $event;
    }

    public function submitForApproval($id)
    {
        $event = $this->getEventById($id);
        if (!$event || !in_array($event->status, ['Draft', 'Rejected'])) {
            return false;
        }

        return $this->eventRepository->update($id, ['status' => 'Pending']);
    }

    public function cancelEvent($id, $reason)
    {
        $event = $this->getEventById($id);
        if (!$event || $event->status !== 'Published') {
            return false;
        }

        return $this->eventRepository->update($id, [
            'status' => 'Cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);
    }
}
