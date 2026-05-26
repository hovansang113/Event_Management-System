<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface ReviewRepositoryInterface
{
    public function getByEvent(int $eventId, string $sort = 'newest'): Collection;
    public function findByUserAndEvent(int $userId, int $eventId);
    public function createReview(array $data);
    public function hasUserReviewed(int $userId, int $eventId): bool;
}
