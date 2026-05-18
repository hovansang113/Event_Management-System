<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Seeder;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $attendee = User::where('email', 'attendee@example.com')->first();
        if (!$attendee) {
            return;
        }

        $events = Event::whereIn('title', [
            'Summer Music Festival 2026',
            'Electronic Music Night',
        ])->get()->keyBy('title');

        $published = $events->get('Summer Music Festival 2026');
        $rejected = $events->get('Electronic Music Night');

        if ($published) {
            Registration::updateOrCreate(
                ['user_id' => $attendee->id, 'event_id' => $published->id],
                ['status' => 'Confirmed', 'position_in_waitlist' => null, 'cancelled_at' => null]
            );
        }

        if ($rejected) {
            Registration::updateOrCreate(
                ['user_id' => $attendee->id, 'event_id' => $rejected->id],
                ['status' => 'Waitlist', 'position_in_waitlist' => 15, 'cancelled_at' => null]
            );
        }
    }
}

