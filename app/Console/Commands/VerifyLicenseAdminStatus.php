<?php

namespace App\Console\Commands;

use App\Models\License;
use Illuminate\Console\Command;

class VerifyLicenseAdminStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'licenses:verify-admin-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify that license owners are still admins of assigned guilds';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting license admin status verification...');

        $activeLicenses = License::active()
            ->with(['user', 'assignedGuild'])
            ->get();

        $parkedCount = 0;
        $verifiedCount = 0;

        foreach ($activeLicenses as $license) {
            $user = $license->user;
            $guild = $license->assignedGuild;

            if (!$guild) {
                $this->warn("License {$license->id} is active but has no assigned guild. Parking...");
                $license->park();
                $parkedCount++;
                continue;
            }

            // Check if user is still admin of the guild
            if (!$user->isAdminOf($guild)) {
                $this->warn("User {$user->id} is no longer admin of guild {$guild->id}. Parking license {$license->id}...");
                $license->park();
                $parkedCount++;
            } else {
                $verifiedCount++;
            }
        }

        $this->info("Verification complete:");
        $this->info("- Verified: {$verifiedCount} licenses");
        $this->info("- Parked: {$parkedCount} licenses");

        return Command::SUCCESS;
    }
}
