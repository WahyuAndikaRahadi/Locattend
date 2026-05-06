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

        // Build attendance status display
        $attendanceStatus = null;
        $attendanceStatusBadge = null;

        if ($todayAttendance) {
            if ($todayAttendance->clock_out_time) {
                // Fully clocked out
                $hours = intdiv($todayAttendance->duration_minutes, 60);
                $minutes = $todayAttendance->duration_minutes % 60;
                $durationText = "{$hours} jam " . ($minutes > 0 ? "{$minutes} menit" : "");

                $attendanceStatus = "Sudah Absen Keluar ({$todayAttendance->clock_out_time}) — Durasi: {$durationText}";

                if ($todayAttendance->is_late) {
                    $attendanceStatusBadge = "Terlambat – {$todayAttendance->late_minutes} menit";
                } else {
                    $attendanceStatusBadge = 'Tepat Waktu';
                }
            } else {
                // Only clocked in
                $attendanceStatus = "Sudah Absen Masuk ({$todayAttendance->clock_in_time})";

                if ($todayAttendance->is_late) {
                    $attendanceStatusBadge = "Terlambat – {$todayAttendance->late_minutes} menit";
                } else {
                    $attendanceStatusBadge = 'Tepat Waktu';
                }
            }
        } else {
            // Check for approved leaves today
            $approvedTodayLeave = $user->leaves()
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', today())
                ->whereDate('end_date', '>=', today())
                ->first();

            if ($approvedTodayLeave) {
                $attendanceStatus = 'Izin';
                $attendanceStatusBadge = 'Izin Disetujui';
            } else {
                $attendanceStatus = 'Belum Absen';
                $attendanceStatusBadge = null;
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
            'attendanceStatus' => $attendanceStatus,
            'attendanceStatusBadge' => $attendanceStatusBadge,
            'pendingLeavesCount' => $pendingLeavesCount,
            'office' => $user->office,
        ];

        // Supervisor-specific: team stats
        if ($user->hasRole('supervisor')) {
            $teamIds = User::role('karyawan')->where('office_id', $user->office_id)->pluck('id');

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
