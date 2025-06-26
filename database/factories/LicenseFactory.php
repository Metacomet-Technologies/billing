<?php

namespace Database\Factories;

use App\Models\License;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\License>
 */
class LicenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement([License::TYPE_SUBSCRIPTION, License::TYPE_LIFETIME]),
            'stripe_id' => 'stripe_' . fake()->unique()->randomNumber(8),
            'status' => License::STATUS_PARKED,
            'assigned_guild_id' => null,
            'last_assigned_at' => null,
        ];
    }

    /**
     * Indicate that the license is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => License::STATUS_ACTIVE,
            'last_assigned_at' => now()->subDays(fake()->numberBetween(1, 10)),
        ]);
    }

    /**
     * Indicate that the license is a subscription.
     */
    public function subscription(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => License::TYPE_SUBSCRIPTION,
        ]);
    }

    /**
     * Indicate that the license is lifetime.
     */
    public function lifetime(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => License::TYPE_LIFETIME,
        ]);
    }
}
