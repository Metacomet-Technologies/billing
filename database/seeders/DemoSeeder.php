<?php

namespace Database\Seeders;

use App\Models\Guild;
use App\Models\License;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a demo user
        $user = User::create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Create some demo guilds for the user
        $guilds = [
            [
                'name' => 'My Gaming Server',
                'discord_id' => '123456789012345678',
                'user_id' => $user->id,
            ],
            [
                'name' => 'Community Hub',
                'discord_id' => '987654321098765432',
                'user_id' => $user->id,
            ],
            [
                'name' => 'Test Server',
                'discord_id' => '456789123456789123',
                'user_id' => $user->id,
            ],
        ];

        foreach ($guilds as $guildData) {
            Guild::create($guildData);
        }

        // Create some demo licenses
        $licenses = [
            [
                'user_id' => $user->id,
                'type' => License::TYPE_SUBSCRIPTION,
                'status' => License::STATUS_PARKED,
                'stripe_id' => 'sub_demo_123',
                'last_assigned_at' => null,
                'transfer_available_at' => null,
            ],
            [
                'user_id' => $user->id,
                'type' => License::TYPE_LIFETIME,
                'status' => License::STATUS_ACTIVE,
                'stripe_id' => 'pi_demo_456',
                'guild_id' => Guild::where('user_id', $user->id)->first()->id,
                'last_assigned_at' => now()->subDays(5),
                'transfer_available_at' => now()->addDays(25),
            ],
            [
                'user_id' => $user->id,
                'type' => License::TYPE_SUBSCRIPTION,
                'status' => License::STATUS_ACTIVE,
                'stripe_id' => 'sub_demo_789',
                'guild_id' => Guild::where('user_id', $user->id)->skip(1)->first()->id,
                'last_assigned_at' => now()->subDays(45),
                'transfer_available_at' => null, // Can be transferred (past cooldown)
            ],
        ];

        foreach ($licenses as $licenseData) {
            License::create($licenseData);
        }

        $this->command->info('Demo data created successfully!');
        $this->command->info('Login with: demo@example.com / password');
    }
}
