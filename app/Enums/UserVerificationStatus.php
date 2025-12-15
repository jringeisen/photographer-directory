<?php

namespace App\Enums;

enum UserVerificationStatus: string
{
    case Unverified = 'unverified';
    case InReview = 'in_review';
    case Verified = 'verified';
    case Rejected = 'rejected';
}
