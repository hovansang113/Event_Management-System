<?php

namespace App\Repositories\Eloquent;

use App\Enums\EventStatus;
use App\Models\Event;
use App\Repositories\Interfaces\EventRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EventRepository extends BaseRepository implements EventRepositoryInterface
{
    public function __construct(Event $model)
    {
        parent::__construct($model);
    }

    public function findById(int|string $id, array $columns = ['*'], array $relations = ['category', 'organizer'], array $appends = []): ?Event
    {
        return $this->model->with($relations)
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
                'registrations as waitlist_count'  => fn($q) => $q->where('status', 'Waitlist'),
            ])
            ->find($id);
    }

    public function getOrganizerEvents(int $organizerId, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->where('organizer_id', $organizerId)
            ->with(['category:id,name'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
                'registrations as waitlist_count' => fn($q) => $q->where('status', 'Waitlist')
            ]);

        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $query->where('status', $filters['status']);
        }

        $sort = $filters['sort'] ?? 'newest';
        $query->orderBy('created_at', $sort === 'newest' ? 'desc' : 'asc');

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getOrganizerStatistics(int $organizerId): array
    {
        $today = now()->toDateString();
        $events = $this->model->where('organizer_id', $organizerId)
            ->withCount(['registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed')])
            ->get();

        return [
            'total_events'    => $events->count(),
            'published_count' => $events->where('status', EventStatus::PUBLISHED->value)->count(),
            'total_attendees' => $events->sum('confirmed_count'),
            'upcoming_events' => $events->where('event_date', '>=', $today)->count(),
        ];
    }

    public function getAllForAdmin(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['category:id,name,slug', 'organizer:id,name,email'])
            ->withCount([
                'registrations as registered' => fn($q) => $q->where('status', 'Confirmed'),
            ]);

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category'])) {
            $query->whereHas('category', fn($q) => $q->where('slug', $filters['category']));
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('organizer', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getPublishedForAttendee(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->with(['category:id,name,slug', 'organizer:id,name,email'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
                'registrations as waitlist_count' => fn($q) => $q->where('status', 'Waitlist'),
            ])
            ->where('status', EventStatus::PUBLISHED->value)
            ->whereHas('category', fn($q) => $q->where('is_active', true));

        if (!empty($filters['category'])) {
            $category = $filters['category'];
            $query->whereHas('category', fn($q) => $q->where('slug', $category)->orWhere('id', $category));
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

        return $query->paginate(min((int) ($filters['per_page'] ?? 3), 100));
    }

    public function findPublishedByIdForAttendee(int $id): ?Event
    {
        return $this->model->query()
            ->with(['category:id,name,slug', 'organizer:id,name,email', 'registrations'])
            ->withCount([
                'registrations as confirmed_count' => fn($q) => $q->where('status', 'Confirmed'),
                'registrations as waitlist_count' => fn($q) => $q->where('status', 'Waitlist'),
            ])
            ->where('status', EventStatus::PUBLISHED->value)
            ->whereHas('category', fn($q) => $q->where('is_active', true))
            ->find($id);
    }

    public function getAdminStatistics(): array
    {
        $today = now()->toDateString();

        return [
            'total_pending'   => $this->model->where('status', EventStatus::PENDING->value)->count(),
            'total_published' => $this->model->where('status', EventStatus::PUBLISHED->value)->count(),
            'total_rejected'  => $this->model->where('status', EventStatus::REJECTED->value)->count(),
            'approved_today'  => $this->model->where('status', EventStatus::PUBLISHED->value)->whereDate('updated_at', $today)->count(),
            'rejected_today'  => $this->model->where('status', EventStatus::REJECTED->value)->whereDate('updated_at', $today)->count(),
        ];
    }
}
