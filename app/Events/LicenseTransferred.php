<?php

namespace App\Events;

use App\Models\Guild;
use App\Models\License;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LicenseTransferred
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public License $license,
        public Guild $newGuild,
        public ?Guild $previousGuild = null
    ) {
        //
    }
}
