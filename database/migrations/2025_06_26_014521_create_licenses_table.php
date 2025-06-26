<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['subscription', 'lifetime']);
            $table->string('stripe_id')->nullable()->index();
            $table->enum('status', ['active', 'parked'])->default('parked');
            $table->foreignId('assigned_guild_id')->nullable()->constrained('guilds')->onDelete('set null');
            $table->timestamp('last_assigned_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('assigned_guild_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};
