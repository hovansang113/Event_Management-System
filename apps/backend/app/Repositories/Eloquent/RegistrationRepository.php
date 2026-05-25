<?php

namespace App\Repositories\Eloquent;

use App\Models\Registration;
use App\Repositories\Interfaces\RegistrationRepositoryInterface;

class RegistrationRepository implements RegistrationRepositoryInterface
{
    public function getConfirmedCount(int $eventId): int
    {
        return Registration::where('event_id', $eventId)
            ->where('status', 'Confirmed')
            ->count();
    }

    public function createRegistration(array $data)
    {
        return Registration::create($data);
    }

    public function getNextInWaitlist(int $eventId)
    {
        return Registration::where('event_id', $eventId)
            ->where('status', 'Waitlist')
            ->orderBy('position_in_waitlist', 'asc')
            ->lockForUpdate()
            ->first();
    }

    public function findById(int $id)
    {
        return Registration::findOrFail($id);
    }

    public function update(int $id, array $data)
    {
        return Registration::findOrFail($id)->update($data);
    }
}
