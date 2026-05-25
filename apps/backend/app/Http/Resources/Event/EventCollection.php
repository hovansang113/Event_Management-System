<?php

namespace App\Http\Resources\Event;

use App\Http\Resources\Base\BaseCollection;
use Illuminate\Http\Request;

class EventCollection extends BaseCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
