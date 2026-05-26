<?php

namespace App\Services;

use App\Enums\EventStatus;
use App\Exceptions\ApiException;
use App\Repositories\Interfaces\EventRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Mail\EventCancelledMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Event;

class EventService extends BaseService
{
    protected EventRepositoryInterface $eventRepository;
    protected CategoryRepositoryInterface $categoryRepository;

    public function __construct(
        EventRepositoryInterface $eventRepository, 
        CategoryRepositoryInterface $categoryRepository
    ) {
        parent::__construct($eventRepository);
        $this->eventRepository = $eventRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function getActiveCategories()
    {
        return $this->categoryRepository->getActive();
    }

    public function createEvent(array $data): Event
    {
        $data['organizer_id'] = auth('api')->id();
        $data['status'] = $data['status'] ?? EventStatus::DRAFT->value;

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $data['image']->store('events', 'public');
            $data['image'] = Storage::url($path);
        }

        $event = $this->eventRepository->create($data);
        
        return $event->load(['category', 'organizer']);
    }

    public function getOrganizerDashboard(array $filters): LengthAwarePaginator
    {
        $organizerId = auth('api')->id();
        return $this->eventRepository->getOrganizerEvents($organizerId, $filters);
    }

    public function getOrganizerStats(): array
    {
        $organizerId = auth('api')->id();
        return $this->eventRepository->getOrganizerStatistics($organizerId);
    }

    public function getEventById($id): ?Event
    {
        $event = $this->eventRepository->findById($id);
        
        if (!$event || $event->organizer_id !== auth('api')->id()) {
            return null;
        }

        return $event;
    }

    public function submitForApproval($id): bool
    {
        $event = $this->getEventById($id);
        if (!$event || !in_array($event->status, [EventStatus::DRAFT->value, EventStatus::REJECTED->value])) {
            return false;
        }
        return $this->eventRepository->update($id, ['status' => EventStatus::PENDING->value]);
    }

    public function cancelEvent($id, $reason): bool
    {
        $event = $this->getEventById($id);
        if (!$event || $event->status !== EventStatus::PUBLISHED->value) {
            return false;
        }

        $result = $this->eventRepository->update($id, [
            'status' => EventStatus::CANCELLED->value,
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        if ($result) {
            $event->refresh();
            $registrations = $event->registrations()->where('status', 'Confirmed')->get();
            foreach ($registrations as $registration) {
                Mail::to($registration->user->email)->send(new EventCancelledMail($event));
            }
        }

        return $result;
    }

    public function updateEvent($id, array $data): ?Event
    {
        $event = $this->getEventById($id);
        if (!$event || in_array($event->status, [EventStatus::PENDING->value, EventStatus::PUBLISHED->value])) {
            return null;
        }

        if (isset($data['capacity'])) {
            $confirmedCount = $event->registrations()->where('status', 'Confirmed')->count();
            if ($data['capacity'] < $confirmedCount) {
                throw new ApiException(
                    "Cannot reduce capacity below current registrations ({$confirmedCount})",
                    422
                );
            }
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($event->image) {
                $oldPath = str_replace('/storage/', '', $event->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $data['image']->store('events', 'public');
            $data['image'] = Storage::url($path);
        }

        $this->eventRepository->update($id, $data);
        return $this->eventRepository->findById($id);
    }

    public function approveEvent($id): Event
    {
        $event = $this->eventRepository->findById($id);
        
        if (!$event) {
            throw new ApiException('Event not found', 404);
        }
        if ($event->status !== EventStatus::PENDING->value) {
            throw new ApiException('Only pending events can be approved', 400);
        }

        $this->eventRepository->update($id, ['status' => EventStatus::PUBLISHED->value]);

        return $event->refresh();
    }

    public function rejectEvent($id, $reason): Event
    {
        $event = $this->eventRepository->findById($id);
        
        if (!$event) {
            throw new ApiException('Event not found', 404);
        }
        if ($event->status !== EventStatus::PENDING->value) {
            throw new ApiException('Only pending events can be rejected', 400);
        }

        $this->eventRepository->update($id, [
            'status' => EventStatus::REJECTED->value,
            'rejection_reason' => $reason,
        ]);

        return $event->refresh();
    }

    public function getAttendeeEvents(array $filters): LengthAwarePaginator
    {
        return $this->eventRepository->getPublishedForAttendee($filters);
    }

    public function getAttendeeEventById(int $id): ?Event
    {
        return $this->eventRepository->findPublishedByIdForAttendee($id);
    }

    public function getAdminEvents(array $filters): LengthAwarePaginator
    {
        return $this->eventRepository->getAllForAdmin($filters);
    }

    public function getAdminStats(): array
    {
        return $this->eventRepository->getAdminStatistics();
    }
}
