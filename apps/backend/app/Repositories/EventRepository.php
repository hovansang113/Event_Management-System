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

    public function getAllForAdmin(array $filters = []): LengthAwarePaginator
    {
        $query = Event::query()
            ->with(['category:id,name,slug', 'organizer:id,name,email'])
            ->withCount([
                'registrations as registered' => fn($q) => $q->where('status', 'Confirmed'),
            ]);

        // Status filter
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Category filter
        if (!empty($filters['category'])) {
            $query->whereHas('category', fn($q) => $q->where('slug', $filters['category']));
        }

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('organizer', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        // Sorting
        $query->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getPublishedForAttendee(array $filters = []): LengthAwarePaginator
    {
        $query = Event::query()
            ->with(['category:id,name,slug', 'organizer:id,name,email'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
            ])
            ->where('status', 'Published')
            ->whereHas('category', fn($q) => $q->where('is_active', true));

        if (!empty($filters['category'])) {
            $category = $filters['category'];
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        if (!empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('event_date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('event_date', '<=', $filters['date_to']);
        }

        $sort = $filters['sort'] ?? 'newest';
        if ($sort === 'event_date_asc') {
            $query->orderBy('event_date', 'asc')->orderBy('event_time', 'asc');
        } elseif ($sort === 'popular') {
            $query->orderByDesc('confirmed_count')->orderByDesc('created_at');
        } else {
            $query->orderByDesc('created_at');
        }

        $perPage = min((int) ($filters['per_page'] ?? 3), 100);
        return $query->paginate($perPage);
    }

    public function findPublishedByIdForAttendee(int $id): ?Event
    {
        return Event::query()
            ->with(['category:id,name,slug', 'organizer:id,name,email'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
            ])
            ->where('status', 'Published')
            ->whereHas('category', fn($q) => $q->where('is_active', true))
            ->find($id);
    }

    public function getAdminStatistics(): array
    {
        $today = now()->toDateString();

        $totalEvents = Event::count();
        $pendingEvents = Event::where('status', 'Pending')->count();
        $publishedEvents = Event::where('status', 'Published')->count();
        $rejectedEvents = Event::where('status', 'Rejected')->count();
        $approvedToday = Event::where('status', 'Published')
            ->whereDate('updated_at', $today)
            ->count();
        $rejectedToday = Event::where('status', 'Rejected')
            ->whereDate('updated_at', $today)
            ->count();

        return [
            'total_pending' => $pendingEvents,
            'total_published' => $publishedEvents,
            'total_rejected' => $rejectedEvents,
            'approved_today' => $approvedToday,
            'rejected_today' => $rejectedToday,
        ];
    }
}
