<?php

namespace App\Enums;

enum FlagStatus: string
{
    case Pending = 'pending';
    case Resolved = 'resolved';
    case Rejected = 'rejected';
}
