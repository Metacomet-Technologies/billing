<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Models\License;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LicenseController extends Controller
{

    /**
     * Display a listing of the user's licenses.
     */
    public function index()
    {
        $user = Auth::user();
        $licenses = $user->licenses()
            ->with(['assignedGuild'])
            ->get();

        return response()->json([
            'licenses' => $licenses->map(function ($license) {
                return [
                    'id' => $license->id,
                    'type' => $license->type,
                    'status' => $license->status,
                    'assigned_guild' => $license->assignedGuild,
                    'can_be_transferred' => $license->canBeTransferred(),
                    'transfer_available_at' => $license->transfer_available_at,
                    'last_assigned_at' => $license->last_assigned_at,
                ];
            })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not needed - licenses are created through billing
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Not needed - licenses are created through billing
    }

    /**
     * Display the specified resource.
     */
    public function show(License $license)
    {
        $this->authorize('view', $license);

        return response()->json([
            'license' => [
                'id' => $license->id,
                'type' => $license->type,
                'status' => $license->status,
                'assigned_guild' => $license->assignedGuild,
                'can_be_transferred' => $license->canBeTransferred(),
                'transfer_available_at' => $license->transfer_available_at,
                'last_assigned_at' => $license->last_assigned_at,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(License $license)
    {
        // Not needed for this API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, License $license)
    {
        $this->authorize('update', $license);

        // Handle license assignment/parking actions
        $action = $request->input('action');

        switch ($action) {
            case 'assign':
                return $this->assignLicense($request, $license);
            case 'park':
                return $this->parkLicense($license);
            default:
                return response()->json(['error' => 'Invalid action'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(License $license)
    {
        $this->authorize('delete', $license);

        // Note: You may want to handle subscription cancellation here
        $license->delete();

        return response()->json(['message' => 'License deleted successfully']);
    }

    /**
     * Assign a license to a guild.
     */
    public function assignLicense(Request $request, License $license)
    {
        $request->validate([
            'guild_id' => 'required|exists:guilds,id',
        ]);

        $guild = Guild::findOrFail($request->guild_id);

        $this->authorize('assign', [$license, $guild]);

        if ($license->assignToGuild($guild)) {
            return response()->json([
                'message' => 'License assigned successfully',
                'license' => $license->fresh(['assignedGuild'])
            ]);
        }

        return response()->json(['error' => 'Unable to assign license'], 400);
    }

    /**
     * Park (unassign) a license.
     */
    public function parkLicense(License $license)
    {
        $this->authorize('park', $license);

        if ($license->park()) {
            return response()->json([
                'message' => 'License parked successfully',
                'license' => $license->fresh()
            ]);
        }

        return response()->json(['error' => 'Unable to park license'], 400);
    }

    /**
     * Get available guilds for assignment.
     */
    public function availableGuilds()
    {
        $user = Auth::user();
        $guilds = $user->adminGuilds()
            ->whereDoesntHave('activeLicense')
            ->get(['guilds.id', 'guilds.name', 'guilds.discord_id']);

        return response()->json(['guilds' => $guilds]);
    }
}
