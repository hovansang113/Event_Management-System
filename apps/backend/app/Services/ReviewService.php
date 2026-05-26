<?php

namespace App\Services;

use App\Repositories\Interfaces\ReviewRepositoryInterface;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Support\Facades\DB;

class ReviewService extends BaseService
{
    protected $repo;

    public function __construct(ReviewRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function getEventReviews(int $eventId, string $sort = 'newest')
    {
        return $this->repo->getByEvent($eventId, $sort);
    }

    public function submitReview(int $userId, int $eventId, array $data)
    {
        return DB::transaction(function () use ($userId, $eventId, $data) {
            $event = Event::findOrFail($eventId);

            if ($event->event_date >= now()->startOfDay()) {
                throw new \Exception('Reviews are only available after the event has ended.');
            }

            $registration = Registration::where('user_id', $userId)
                ->where('event_id', $eventId)
                ->where('status', 'Confirmed')
                ->first();

            if (!$registration) {
                throw new \Exception('You must have a confirmed registration to review this event.');
            }

            if ($this->repo->hasUserReviewed($userId, $eventId)) {
                throw new \Exception('You have already reviewed this event.');
            }

            $review = $this->repo->createReview([
                'user_id' => $userId,
                'event_id' => $eventId,
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]);

            $review->load('user');

            return $review;
        });
    }
}
