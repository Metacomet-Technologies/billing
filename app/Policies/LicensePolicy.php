<?php

namespace App\Policies;

use App\Models\Guild;
use App\Models\License;
use App\Models\User;

class LicensePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, License $license): bool
    {
        return $user->id === $license->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, License $license): bool
    {
        return $user->id === $license->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, License $license): bool
    {
        return $user->id === $license->user_id;
    }

    /**
     * Determine whether the user can assign the license to a guild.
     */
    public function assign(User $user, License $license, Guild $guild): bool
    {
        // User must own the license
        if ($user->id !== $license->user_id) {
            return false;
        }

        // User must be admin of the target guild
        if (!$user->isAdminOf($guild)) {
            return false;
        }

        // Guild must not already have an active license
        if ($guild->hasActiveLicense()) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can park (unassign) the license.
     */
    public function park(User $user, License $license): bool
    {
        // User must own the license
        if ($user->id !== $license->user_id) {
            return false;
        }

        // License must be active to be parked
        return $license->isActive();
    }

    /**
     * Determine whether the user can transfer the license.
     */
    public function transfer(User $user, License $license, Guild $newGuild): bool
    {
        return $this->assign($user, $license, $newGuild);
    }
}
