<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Guild extends Model
{
    use HasFactory;

    protected $fillable = [
        'discord_id',
        'name',
    ];

    /**
     * Get the users that belong to this guild.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'guild_users')
                    ->withPivot('is_admin')
                    ->withTimestamps();
    }

    /**
     * Get the admin users of this guild.
     */
    public function admins(): BelongsToMany
    {
        return $this->users()->wherePivot('is_admin', true);
    }

    /**
     * Get the active license assigned to this guild.
     */
    public function activeLicense(): HasOne
    {
        return $this->hasOne(License::class, 'assigned_guild_id')
                    ->where('status', 'active');
    }

    /**
     * Check if this guild has an active license.
     */
    public function hasActiveLicense(): bool
    {
        return $this->activeLicense()->exists();
    }
}
