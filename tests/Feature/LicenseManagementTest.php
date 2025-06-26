<?php

use App\Models\Guild;
use App\Models\License;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create(['discord_id' => '123456789']);
    $this->guild = Guild::factory()->create();

    // Make user admin of the guild
    $this->user->guilds()->attach($this->guild, ['is_admin' => true]);

    $this->actingAs($this->user);
});

test('user can assign parked license to guild', function () {
    $license = License::factory()->create([
        'user_id' => $this->user->id,
        'status' => License::STATUS_PARKED,
    ]);

    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'assign',
        'guild_id' => $this->guild->id,
    ]);

    $response->assertOk();

    $license->refresh();
    expect($license->status)->toBe(License::STATUS_ACTIVE);
    expect($license->assigned_guild_id)->toBe($this->guild->id);
    expect($license->last_assigned_at)->not->toBeNull();
});

test('user can park active license', function () {
    $license = License::factory()->active()->create([
        'user_id' => $this->user->id,
        'assigned_guild_id' => $this->guild->id,
    ]);

    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'park',
    ]);

    $response->assertOk();

    $license->refresh();
    expect($license->status)->toBe(License::STATUS_PARKED);
    expect($license->assigned_guild_id)->toBeNull();
});

test('user cannot assign license they do not own', function () {
    $otherUser = User::factory()->create();
    $license = License::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'assign',
        'guild_id' => $this->guild->id,
    ]);

    $response->assertForbidden();
});

test('user cannot assign license to guild they are not admin of', function () {
    $otherGuild = Guild::factory()->create();
    $license = License::factory()->create(['user_id' => $this->user->id]);

    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'assign',
        'guild_id' => $otherGuild->id,
    ]);

    $response->assertForbidden();
});

test('license cannot be assigned to guild that already has active license', function () {
    $existingLicense = License::factory()->active()->create([
        'assigned_guild_id' => $this->guild->id,
    ]);

    $newLicense = License::factory()->create(['user_id' => $this->user->id]);

    $response = $this->put("/licenses/{$newLicense->id}", [
        'action' => 'assign',
        'guild_id' => $this->guild->id,
    ]);

    $response->assertForbidden();
});

test('license cannot be transferred within cooldown period', function () {
    $license = License::factory()->active()->create([
        'user_id' => $this->user->id,
        'assigned_guild_id' => $this->guild->id,
        'last_assigned_at' => now()->subDays(10), // Within 30-day cooldown
    ]);

    $newGuild = Guild::factory()->create();
    $this->user->guilds()->attach($newGuild, ['is_admin' => true]);

    // First park the license
    $this->put("/licenses/{$license->id}", ['action' => 'park']);

    // Try to assign to new guild (should fail due to cooldown)
    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'assign',
        'guild_id' => $newGuild->id,
    ]);

    $response->assertStatus(400);
});

test('license can be transferred after cooldown period', function () {
    $license = License::factory()->active()->create([
        'user_id' => $this->user->id,
        'assigned_guild_id' => $this->guild->id,
        'last_assigned_at' => now()->subDays(31), // Past 30-day cooldown
    ]);

    $newGuild = Guild::factory()->create();
    $this->user->guilds()->attach($newGuild, ['is_admin' => true]);

    // First park the license
    $this->put("/licenses/{$license->id}", ['action' => 'park']);

    // Assign to new guild (should succeed)
    $response = $this->put("/licenses/{$license->id}", [
        'action' => 'assign',
        'guild_id' => $newGuild->id,
    ]);

    $response->assertOk();

    $license->refresh();
    expect($license->assigned_guild_id)->toBe($newGuild->id);
});

test('user can view their own licenses', function () {
    $license1 = License::factory()->create(['user_id' => $this->user->id]);
    $license2 = License::factory()->create(['user_id' => $this->user->id]);
    $otherLicense = License::factory()->create(); // Different user

    $response = $this->get('/licenses');

    $response->assertOk();
    $data = $response->json();

    expect($data['licenses'])->toHaveCount(2);
    expect(collect($data['licenses'])->pluck('id')->sort()->values()->toArray())
        ->toEqual([$license1->id, $license2->id]);
});

test('user can get available guilds for assignment', function () {
    // Create another guild where user is admin
    $anotherGuild = Guild::factory()->create();
    $this->user->guilds()->attach($anotherGuild, ['is_admin' => true]);

    // Create a guild where user is not admin
    $notAdminGuild = Guild::factory()->create();
    $this->user->guilds()->attach($notAdminGuild, ['is_admin' => false]);

    // Create a guild with existing license
    $guildWithLicense = Guild::factory()->create();
    $this->user->guilds()->attach($guildWithLicense, ['is_admin' => true]);
    License::factory()->active()->create(['assigned_guild_id' => $guildWithLicense->id]);

    $response = $this->get('/licenses/guilds/available');

    $response->assertOk();
    $data = $response->json();

    // Should only return guilds where user is admin AND no active license
    expect($data['guilds'])->toHaveCount(2);
    $guildIds = collect($data['guilds'])->pluck('id')->sort()->values()->toArray();
    expect($guildIds)->toEqual([$this->guild->id, $anotherGuild->id]);
});
