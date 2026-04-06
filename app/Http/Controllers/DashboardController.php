<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Leave;
use App\Models\User;
use App\Models\Office;

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

        // If no attendance, check for approved leaves today
        if (!$todayAttendance) {
            $approvedTodayLeave = $user->leaves()
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', today())
                ->whereDate('end_date', '>=', today())
                ->first();
            
            if ($approvedTodayLeave) {
                $todayAttendance = (object)[
                    'status' => 'izin', // Merge 'cuti' -> 'izin' for UI
                    'clock_in_time' => null
                ];
            }
        }

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
            $data['teamPresentToday'] = Attendance::whereIn('user_id', $teamIds)
                ->whereDate('date', today())
                ->where('status', 'hadir')
                ->count();
            
            $data['teamOnLeaveToday'] = Leave::whereIn('user_id', $teamIds)
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', today())
                ->whereDate('end_date', '>=', today())
                ->count();

            $data['teamPendingLeaves'] = Leave::whereIn('user_id', $teamIds)
                ->where('status', 'pending')
                ->count();
        }

        // Admin-specific: global stats
        if ($user->hasRole('admin')) {
            $data['totalUsers'] = User::count();
            $data['totalOffices'] = Office::count();
            $data['todayTotalAttendance'] = Attendance::whereDate('date', today())
                ->where('status', 'hadir')
                ->count();
            $data['totalOnLeaveToday'] = Leave::where('status', 'approved')
                ->whereDate('start_date', '<=', today())
                ->whereDate('end_date', '>=', today())
                ->count();
            $data['totalPendingLeaves'] = Leave::where('status', 'pending')->count();

            // Additional Admin Analytics
            // Recent Activities (Latest 5 attendances)
            $data['recentActivities'] = \App\Models\Attendance::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($att) => [
                    'id' => $att->id,
                    'user_name' => $att->user->name,
                    'time' => $att->clock_in_time,
                    'status' => 'hadir',
                    'location' => $att->latitude . ',' . $att->longitude
                ]);

            // Attendance Trend (Last 7 days)
            $trends = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->toDateString();
                $count = \App\Models\Attendance::whereDate('date', $date)->count();
                $trends[] = [
                    'date' => now()->subDays($i)->isoFormat('ddd'),
                    'count' => $count
                ];
            }
            $data['attendanceTrends'] = $trends;

        }

        return Inertia::render('Dashboard', $data);
    }
}
