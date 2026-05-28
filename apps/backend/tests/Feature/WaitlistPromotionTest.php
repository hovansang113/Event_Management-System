<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class WaitlistPromotionTest extends TestCase
{
    use RefreshDatabase;

    public function test_waitlist_promotion_works_correctly()
    {
        // 1. Setup: Create organizer, attendee A, attendee B, category, and event with capacity 1
        $organizer = User::factory()->create(['role' => 'organizer']);
        $attendeeA = User::factory()->create(['role' => 'attendee']);
        $attendeeB = User::factory()->create(['role' => 'attendee']);
        $category = Category::create([
            'name' => 'Music',
            'slug' => 'music',
            'is_active' => true
        ]);
        
        $event = Event::create([
            'title' => 'Test Event',
            'description' => 'Test Description',
            'location' => 'Test Location',
            'event_date' => now()->addDays(10)->toDateString(),
            'event_time' => '10:00:00',
            'organizer_id' => $organizer->id,
            'category_id' => $category->id,
            'capacity' => 1,
            'status' => 'Published'
        ]);

        // 2. Attendee A registers (should be Confirmed)
        $this->actingAs($attendeeA, 'api')
            ->postJson("/api/attendee/events/{$event->id}/register")
            ->assertStatus(200);

        $this->assertDatabaseHas('registrations', [
            'user_id' => $attendeeA->id,
            'event_id' => $event->id,
            'status' => 'Confirmed'
        ]);

        // 3. Attendee B registers (should be Waitlist)
        $this->actingAs($attendeeB, 'api')
            ->postJson("/api/attendee/events/{$event->id}/register")
            ->assertStatus(200);

        $this->assertDatabaseHas('registrations', [
            'user_id' => $attendeeB->id,
            'event_id' => $event->id,
            'status' => 'Waitlist',
            'position_in_waitlist' => 1
        ]);

        // Check counts
        $response = $this->getJson("/api/attendee/events/{$event->id}");
        $response->assertJsonPath('data.registered', 1);
        $response->assertJsonPath('data.waitlist_count', 1);

        // 4. Attendee A cancels
        $registrationA = Registration::where('user_id', $attendeeA->id)->first();
        $this->actingAs($attendeeA, 'api')
            ->deleteJson("/api/attendee/registrations/{$registrationA->id}")
            ->assertStatus(200);

        // 5. Verify promotion: Attendee B should now be Confirmed
        $this->assertDatabaseHas('registrations', [
            'user_id' => $attendeeB->id,
            'event_id' => $event->id,
            'status' => 'Confirmed',
            'position_in_waitlist' => null
        ]);

        $this->assertDatabaseHas('registrations', [
            'user_id' => $attendeeA->id,
            'event_id' => $event->id,
            'status' => 'Cancelled'
        ]);

        // 6. Verify counts: Registered should still be 1, Waitlist should be 0
        $response = $this->getJson("/api/attendee/events/{$event->id}");
        $response->assertJsonPath('data.registered', 1);
        $response->assertJsonPath('data.waitlist_count', 0);
    }

    public function test_cancellation_without_waitlist_decreases_count()
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $attendeeA = User::factory()->create(['role' => 'attendee']);
        $category = Category::create([
            'name' => 'Tech',
            'slug' => 'tech',
            'is_active' => true
        ]);
        
        $event = Event::create([
            'title' => 'Tech Event',
            'description' => 'Tech Description',
            'location' => 'Tech Location',
            'event_date' => now()->addDays(5)->toDateString(),
            'event_time' => '14:00:00',
            'organizer_id' => $organizer->id,
            'category_id' => $category->id,
            'capacity' => 10,
            'status' => 'Published'
        ]);

        $this->actingAs($attendeeA, 'api')
            ->postJson("/api/attendee/events/{$event->id}/register")
            ->assertStatus(200);

        $registrationA = Registration::where('user_id', $attendeeA->id)->first();
        $this->actingAs($attendeeA, 'api')
            ->deleteJson("/api/attendee/registrations/{$registrationA->id}")
            ->assertStatus(200);

        $response = $this->getJson("/api/attendee/events/{$event->id}");
        $response->assertJsonPath('data.registered', 0);
    }
}
