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
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
