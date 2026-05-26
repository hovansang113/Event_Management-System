<?php

namespace App\Repositories\Eloquent;

use App\Models\Review;
use App\Repositories\Interfaces\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function getByEvent(int $eventId, string $sort = 'newest'): Collection
    {
        $query = Review::where('event_id', $eventId)
            ->with('user');

        if ($sort === 'highest') {
            $query->orderBy('rating', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query->get();
    }

    public function findByUserAndEvent(int $userId, int $eventId)
    {
        return Review::where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();
    }

    public function createReview(array $data)
    {
        return Review::create($data);
    }

    public function hasUserReviewed(int $userId, int $eventId): bool
    {
        return Review::where('user_id', $userId)
            ->where('event_id', $eventId)
            ->exists();
    }
}
