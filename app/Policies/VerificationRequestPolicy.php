<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VerificationRequest;

class VerificationRequestPolicy
{
    public function viewAny(?User $user): bool
    {
        return (bool) $user?->is_admin;
    }

    public function view(?User $user, VerificationRequest $verificationRequest): bool
    {
        if (! $user) {
            return false;
        }

        return $user->is_admin || $verificationRequest->user_id === $user->id;
    }

    public function create(?User $user): bool
    {
        return (bool) $user;
    }

    public function update(?User $user, VerificationRequest $verificationRequest): bool
    {
        return (bool) $user?->is_admin;
    }

    public function delete(?User $user, VerificationRequest $verificationRequest): bool
    {
        return (bool) $user?->is_admin;
    }

    public function restore(?User $user, VerificationRequest $verificationRequest): bool
    {
        return false;
    }

    public function forceDelete(?User $user, VerificationRequest $verificationRequest): bool
    {
        return false;
    }
}
