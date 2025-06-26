<?php

namespace App\Models;

use App\Events\LicenseAssigned;
use App\Events\LicenseParked;
use App\Events\LicenseTransferred;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class License extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'stripe_id',
        'status',
        'assigned_guild_id',
        'last_assigned_at',
    ];

    protected $casts = [
        'last_assigned_at' => 'datetime',
    ];

    const TYPE_SUBSCRIPTION = 'subscription';
    const TYPE_LIFETIME = 'lifetime';

    const STATUS_ACTIVE = 'active';
    const STATUS_PARKED = 'parked';

    const TRANSFER_COOLDOWN_DAYS = 30;

    /**
     * Get the user that owns this license.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the guild this license is assigned to.
     */
    public function assignedGuild(): BelongsTo
    {
        return $this->belongsTo(Guild::class, 'assigned_guild_id');
    }

    /**
     * Check if this license can be transferred.
     */
    public function canBeTransferred(): bool
    {
        if (!$this->last_assigned_at) {
            return true; // Never been assigned
        }

        return $this->last_assigned_at->addDays(self::TRANSFER_COOLDOWN_DAYS)->isPast();
    }

    /**
     * Get the date when this license can be transferred again.
     */
    public function getTransferAvailableAtAttribute(): ?Carbon
    {
        if (!$this->last_assigned_at) {
            return null;
        }

        return $this->last_assigned_at->addDays(self::TRANSFER_COOLDOWN_DAYS);
    }

    /**
     * Check if this license is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Check if this license is parked.
     */
    public function isParked(): bool
    {
        return $this->status === self::STATUS_PARKED;
    }

    /**
     * Assign this license to a guild.
     */
    public function assignToGuild(Guild $guild): bool
    {
        if (!$this->canBeTransferred()) {
            return false;
        }

        // Check if guild already has an active license
        if ($guild->hasActiveLicense()) {
            return false;
        }

        $wasParked = $this->isParked();
        $previousGuild = $this->assignedGuild;

        $this->update([
            'status' => self::STATUS_ACTIVE,
            'assigned_guild_id' => $guild->id,
            'last_assigned_at' => now(),
        ]);

        if ($wasParked) {
            LicenseAssigned::dispatch($this, $guild);
        } else {
            LicenseTransferred::dispatch($this, $guild, $previousGuild);
        }

        return true;
    }

    /**
     * Park this license (remove from guild).
     */
    public function park(): bool
    {
        if ($this->isParked()) {
            return false;
        }

        $previousGuild = $this->assignedGuild;

        $this->update([
            'status' => self::STATUS_PARKED,
            'assigned_guild_id' => null,
        ]);

        LicenseParked::dispatch($this, $previousGuild);

        return true;
    }

    /**
     * Scope to get active licenses.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope to get parked licenses.
     */
    public function scopeParked($query)
    {
        return $query->where('status', self::STATUS_PARKED);
    }

    /**
     * Scope to get subscription licenses.
     */
    public function scopeSubscription($query)
    {
        return $query->where('type', self::TYPE_SUBSCRIPTION);
    }

    /**
     * Scope to get lifetime licenses.
     */
    public function scopeLifetime($query)
    {
        return $query->where('type', self::TYPE_LIFETIME);
    }
}
