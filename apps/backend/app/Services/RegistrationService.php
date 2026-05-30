<?php

namespace App\Services;

use App\Repositories\Interfaces\RegistrationRepositoryInterface;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use App\Models\Registration;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\EventPromotedMail;
use App\Mail\EventRegisterMail;

class RegistrationService extends BaseService
{
    protected $repo;

    public function __construct(RegistrationRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function registerUser(int $userId, int $eventId)
    {
        $registration = DB::transaction(function () use ($userId, $eventId) {
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

        // Send confirmation email after transaction commits
        try {
            $registration->load(['user', 'event']);
            if ($registration->user && $registration->user->email) {
                Mail::to($registration->user->email)->send(new EventRegisterMail($registration));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send registration email: ' . $e->getMessage());
        }

        return $registration;
    }

    public function cancelRegistration(int $registrationId)
    {
        $promotedRegistration = DB::transaction(function () use ($registrationId) {
            $reg = Registration::where('id', $registrationId)->lockForUpdate()->firstOrFail();
            
            if ($reg->user_id !== auth('api')->id()) {
                throw new \Exception('Unauthorized action.');
            }

            if ($reg->status === 'Cancelled') return null;

            // Lock the event to prevent concurrent registration/promotion issues
            $event = Event::where('id', $reg->event_id)->lockForUpdate()->firstOrFail();

            $oldStatus = $reg->status;
            $oldPosition = $reg->position_in_waitlist;

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
                    
                    // After promoting someone, all other waitlist positions must be decremented
                    Registration::where('event_id', $reg->event_id)
                        ->where('status', 'Waitlist')
                        ->whereNotNull('position_in_waitlist')
                        ->decrement('position_in_waitlist');
                    
                    return $next;
                }
            } else if ($oldStatus === 'Waitlist' && $oldPosition !== null) {
                // Re-order waitlist positions for those who were behind the cancelled person
                Registration::where('event_id', $reg->event_id)
                    ->where('status', 'Waitlist')
                    ->where('position_in_waitlist', '>', $oldPosition)
                    ->decrement('position_in_waitlist');
            }

            return null;
        });

        // Send promotion email after transaction commits
        if ($promotedRegistration) {
            try {
                $promotedRegistration->load(['user', 'event']);
                if ($promotedRegistration->user && $promotedRegistration->user->email) {
                    Mail::to($promotedRegistration->user->email)->send(new EventPromotedMail($promotedRegistration));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send promotion email: ' . $e->getMessage());
            }
        }

        return true;
    }

    public function getUserRegistrations(int $userId)
    {
        return $this->repo->getByUser($userId);
    }
}
