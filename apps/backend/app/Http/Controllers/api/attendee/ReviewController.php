<?php

namespace App\Http\Controllers\api\attendee;

use App\Http\Controllers\Controller;
use App\Http\Resources\Review\ReviewResource;
use App\Services\ReviewService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(Request $request, int $eventId): JsonResponse
    {
        $sort = $request->query('sort', 'newest');

        $reviews = $this->reviewService->getEventReviews($eventId, $sort);

        return $this->success(ReviewResource::collection($reviews), 'Reviews retrieved successfully');
    }

    public function store(Request $request, int $eventId): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:300',
        ]);

        try {
            $review = $this->reviewService->submitReview(
                auth('api')->id(),
                $eventId,
                $validated
            );

            return $this->success(new ReviewResource($review), 'Review submitted successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
