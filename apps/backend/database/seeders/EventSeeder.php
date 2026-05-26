<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('email', 'organizer@example.com')->first();
        if (!$organizer) {
            return;
        }

        $music = Category::where('name', 'Music')->first();
        $education = Category::where('name', 'Education')->first();
        $arts = Category::where('name', 'Arts')->first();

        if (!$music || !$education || !$arts) {
            return;
        }

        $events = [
            [
                'title' => 'Electronic Music Night',
                'category_id' => $music->id,
                'description' => 'Live EDM performances with guest DJs.',
                'location' => 'Club Venue, New York',
                'event_date' => '2026-09-01',
                'event_time' => '21:00:00',
                'capacity' => 400,
                'status' => 'Rejected',
            ],
            [
                'title' => 'Blockchain & Web3 Summit',
                'category_id' => $education->id,
                'description' => 'A summit about blockchain trends and Web3 applications.',
                'location' => 'Convention Center, Las Vegas',
                'event_date' => '2026-08-12',
                'event_time' => '09:00:00',
                'capacity' => 500,
                'status' => 'Pending',
            ],
            [
                'title' => 'Stand-Up Comedy Night',
                'category_id' => $arts->id,
                'description' => 'An evening of stand-up comedy with local artists.',
                'location' => 'The Laugh Factory, Chicago',
                'event_date' => '2026-07-18',
                'event_time' => '20:00:00',
                'capacity' => 100,
                'status' => 'Draft',
            ],
            [
                'title' => 'Hip-Hop Dance Showcase',
                'category_id' => $arts->id,
                'description' => 'Dance crews and solo performers showcase hip-hop moves.',
                'location' => 'City Arena, Miami',
                'event_date' => '2026-07-05',
                'event_time' => '17:00:00',
                'capacity' => 300,
                'status' => 'Pending',
            ],
            [
                'title' => 'Summer Music Festival 2026',
                'category_id' => $music->id,
                'description' => 'Large outdoor summer festival with multiple stages.',
                'location' => 'Central Park, New York',
                'event_date' => '2026-06-15',
                'event_time' => '18:00:00',
                'capacity' => 500,
                'status' => 'Published',
            ],
        ];

        foreach ($events as $eventData) {
            Event::updateOrCreate(
                [
                    'organizer_id' => $organizer->id,
                    'title' => $eventData['title'],
                ],
                $eventData + ['organizer_id' => $organizer->id]
            );
        }
    }
}

