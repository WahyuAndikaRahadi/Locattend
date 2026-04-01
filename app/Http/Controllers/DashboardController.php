<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $user->load('office');

        $role = 'karyawan';
        if ($user->hasRole('admin')) {
            $role = 'admin';
        } elseif ($user->hasRole('supervisor')) {
            $role = 'supervisor';
        }

        // Get today's attendance for employee
        $todayAttendance = $user->attendances()
            ->whereDate('date', today())
            ->first();

        // Get pending leaves count
        $pendingLeavesCount = $user->leaves()
            ->where('status', 'pending')
            ->count();

        // Base data
        $data = [
            'role' => $role,
            'todayAttendance' => $todayAttendance,
            'pendingLeavesCount' => $pendingLeavesCount,
            'office' => $user->office,
        ];

        // Supervisor-specific: team stats
        if ($user->hasRole('supervisor')) {
            $teamIds = $user->subordinates()->pluck('id');

            $data['teamCount'] = $teamIds->count();
            $data['teamPresentToday'] = \App\Models\Attendance::whereIn('user_id', $teamIds)
                ->whereDate('date', today())
                ->count();
            $data['teamPendingLeaves'] = \App\Models\Leave::whereIn('user_id', $teamIds)
                ->where('status', 'pending')
                ->count();
        }

        // Admin-specific: global stats
        if ($user->hasRole('admin')) {
            $data['totalUsers'] = \App\Models\User::count();
            $data['totalOffices'] = \App\Models\Office::count();
            $data['todayTotalAttendance'] = \App\Models\Attendance::whereDate('date', today())->count();
            $data['totalPendingLeaves'] = \App\Models\Leave::where('status', 'pending')->count();
        }

        return Inertia::render('Dashboard', $data);
    }
}
