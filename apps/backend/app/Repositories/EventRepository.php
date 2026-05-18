<?php
namespace App\Repositories;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

class EventRepository
{
    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function findById(int $id): ?Event
    {
        return Event::with(['category', 'organizer'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
                'registrations as waitlist_count'  => fn($q) => $q->where('status', 'Waitlist'),
            ])
            ->find($id);
    }

    public function update(int $id, array $data): bool
    {
        $event = Event::find($id);
        if (!$event) return false;
        return $event->update($data);
    }

    public function getOrganizerEvents(int $organizerId, array $filters = []): LengthAwarePaginator
    {
        $query = Event::where('organizer_id', $organizerId)
            ->select(['id', 'organizer_id', 'category_id', 'title', 'location', 'event_date', 'event_time', 'capacity', 'status', 'rejection_reason', 'cancellation_reason', 'cancelled_at', 'created_at', 'updated_at'])
            ->with(['category:id,name'])
            ->withCount([
                'registrations as confirmed_count' => function ($query) {
                    $query->where('status', 'Confirmed');
                },
                'registrations as waitlist_count' => function ($query) {
                    $query->where('status', 'Waitlist');
                }
            ]);

        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $query->where('status', $filters['status']);
        }

        $sort = $filters['sort'] ?? 'newest';
        if ($sort === 'newest') {
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'asc');
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getOrganizerStatistics(int $organizerId): array
    {
        $today = now()->toDateString();

        // 1 query lấy tất cả events của organizer
        $events = Event::where('organizer_id', $organizerId)
            ->withCount(['registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed')])
            ->get();

        return [
            'total_events'    => $events->count(),
            'published_count' => $events->where('status', 'Published')->count(),
            'total_attendees' => $events->sum('confirmed_count'),
            'upcoming_events' => $events->where('event_date', '>=', $today)->count(),
        ];
    }
}