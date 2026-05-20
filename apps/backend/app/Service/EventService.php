<?php

namespace App\Service;

use App\Repositories\EventRepository;
use App\Mail\EventCancelledMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
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
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
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

        $result =  $this->eventRepository->update($id, [
            'status' => 'Cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        if($result){
            $registrations = $event->registrations()->where('status', 'Confirmed')->get();
            foreach ($registrations as $registration) {
                //TODO: Send notification email to users about event cancellation
                Mail::to($registration->user->email)->send(new EventCancelledMail($event));
            }
        }

        return $result;
    }

    public function updateEvent($id, array $data){
        $event = $this->getEventById($id);
        if (!$event || $event->status === 'Pending') {
            return null;
        }

        // Validate capacity không thể giảm xuống dưới số đăng ký hiện tại
        if (isset($data['capacity'])) {
            $confirmedCount = $event->registrations()->where('status', 'Confirmed')->count();
            if ($data['capacity'] < $confirmedCount) {
                throw new \Exception("Cannot reduce capacity below current registrations ({$confirmedCount})");
            }
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            // Xóa ảnh cũ nếu có
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
}
