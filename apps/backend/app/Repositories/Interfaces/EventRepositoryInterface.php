<?php

namespace App\Repositories\Interfaces;

use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

interface EventRepositoryInterface extends BaseRepositoryInterface
{
    public function getOrganizerEvents(int $organizerId, array $filters = []): LengthAwarePaginator;
    public function getOrganizerStatistics(int $organizerId): array;
    public function getAllForAdmin(array $filters = []): LengthAwarePaginator;
    public function getPublishedForAttendee(array $filters = []): LengthAwarePaginator;
    public function findPublishedByIdForAttendee(int $id): ?Event;
    public function getAdminStatistics(): array;
}
