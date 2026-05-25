<?php

namespace App\Enums;

enum EventStatus: string
{
    case DRAFT = 'Draft';
    case PENDING = 'Pending';
    case PUBLISHED = 'Published';
    case REJECTED = 'Rejected';
    case CANCELLED = 'Cancelled';
}
