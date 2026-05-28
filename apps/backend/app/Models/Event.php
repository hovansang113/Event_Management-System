<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'organizer_id',
        'category_id',
        'title',
        'description',
        'image',
        'location',
        'event_date',
        'event_time',
        'capacity',
        'status',
        'rejection_reason',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'event_date' => 'date',
        'event_time' => 'string',
        'capacity' => 'integer',
        'status' => \App\Enums\EventStatus::class,
        'cancelled_at' => 'datetime',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
