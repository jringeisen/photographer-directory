<?php

namespace App\Enums;

enum UploadSessionStatus: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case Attached = 'attached';
    case Aborted = 'aborted';
}
