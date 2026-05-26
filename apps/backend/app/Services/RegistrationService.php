<?php

namespace App\Services;

use App\Repositories\Interfaces\RegistrationRepositoryInterface;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use App\Models\Registration;

class RegistrationService extends BaseService
{
    protected $repo;

    public function __construct(RegistrationRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function registerUser(int $userId, int $eventId)
    {
        return DB::transaction(function () use ($userId, $eventId) {
            // Lock event for update to prevent race conditions on capacity
            $event = Event::where('id', $eventId)->lockForUpdate()->firstOrFail();

            $existing = Registration::where('user_id', $userId)
                ->where('event_id', $eventId)
                ->whereIn('status', ['Confirmed', 'Waitlist'])
                ->first();

            if ($existing) {
                throw new \Exception('You are already registered for this event.');
            }

            $confirmedCount = $this->repo->getConfirmedCount($eventId);

            if ($confirmedCount < $event->capacity) {
                return $this->repo->createRegistration([
                    'user_id' => $userId,
                    'event_id' => $eventId,
                    'status' => 'Confirmed'
                ]);
            }

            // Join waitlist
            $lastPos = Registration::where('event_id', $eventId)
                ->where('status', 'Waitlist')
                ->max('position_in_waitlist') ?? 0;

            return $this->repo->createRegistration([
                'user_id' => $userId,
                'event_id' => $eventId,
                'status' => 'Waitlist',
                'position_in_waitlist' => $lastPos + 1
            ]);
        });
    }

    public function cancelRegistration(int $registrationId)
    {
        return DB::transaction(function () use ($registrationId) {
            $reg = Registration::where('id', $registrationId)->lockForUpdate()->firstOrFail();
            
            if ($reg->user_id !== auth('api')->id()) {
                throw new \Exception('Unauthorized action.');
            }

            if ($reg->status === 'Cancelled') return;

            $oldStatus = $reg->status;
            $reg->update(['status' => 'Cancelled', 'cancelled_at' => now(), 'position_in_waitlist' => null]);

            if ($oldStatus === 'Confirmed') {
                $next = Registration::where('event_id', $reg->event_id)
                    ->where('status', 'Waitlist')
                    ->orderBy('position_in_waitlist', 'asc')
                    ->lockForUpdate()
                    ->first();

                if ($next) {
                    $next->update([
                        'status' => 'Confirmed',
                        'position_in_waitlist' => null
                    ]);
                    // TODO: Send notification email to the promoted user
                }
            } else if ($oldStatus === 'Waitlist') {
                // Re-order waitlist positions
                Registration::where('event_id', $reg->event_id)
                    ->where('status', 'Waitlist')
                    ->where('position_in_waitlist', '>', $reg->getOriginal('position_in_waitlist'))
                    ->decrement('position_in_waitlist');
            }
        });
    }

    public function getUserRegistrations(int $userId)
    {
        return $this->repo->getByUser($userId);
    }
}
