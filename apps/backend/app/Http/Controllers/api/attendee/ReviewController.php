<?php

namespace App\Http\Controllers\api\attendee;

use App\Http\Controllers\Controller;
use App\Http\Resources\Review\ReviewResource;
use App\Models\Event;
use App\Models\Registration;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    use ApiResponse;

    public function index(Request $request, int $eventId): JsonResponse
    {
        $event = Event::find($eventId);

        if (!$event) {
            return $this->error('Event not found', 404);
        }

        $sort = $request->query('sort', 'newest');

        $reviews = Review::where('event_id', $eventId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($sort === 'highest') {
            $reviews = $reviews->sortByDesc('rating')->sortByDesc('created_at');
        }

        return $this->success(ReviewResource::collection($reviews), 'Reviews retrieved successfully');
    }

    public function store(Request $request, int $eventId): JsonResponse
    {
        $userId = auth('api')->id();

        $event = Event::find($eventId);
        if (!$event) {
            return $this->error('Event not found', 404);
        }

        if ($event->event_date >= now()->startOfDay()) {
            return $this->error('Reviews are only available after the event has ended.', 400);
        }

        $registration = Registration::where('user_id', $userId)
            ->where('event_id', $eventId)
            ->where('status', 'Confirmed')
            ->first();

        if (!$registration) {
            return $this->error('You must have a confirmed registration to review this event.', 400);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:300',
        ]);

        $existing = Review::where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();

        if ($existing) {
            return $this->error('You have already reviewed this event.', 400);
        }

        try {
            $review = Review::create([
                'user_id' => $userId,
                'event_id' => $eventId,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]);

            $review->load('user');

            return $this->success(new ReviewResource($review), 'Review submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
