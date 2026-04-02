<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Leave;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupervisorController extends Controller
{
    /**
     * Show the supervisor team dashboard with charts.
     */
    public function team(Request $request)
    {
        $user = $request->user();
        $subordinateIds = $user->subordinates()->pluck('id');

        // Get team members
        $teamMembers = $user->subordinates()
            ->select('id', 'name', 'email')
            ->get()
            ->map(function ($member) {
                $todayAttendance = $member->attendances()
                    ->whereDate('date', today())
                    ->first();
                $member->today_status = $todayAttendance ? $todayAttendance->status : 'belum_absen';
                return $member;
            });

        // Attendance data for the last 7 days (for Bar Chart)
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayAttendances = Attendance::whereIn('user_id', $subordinateIds)
                ->whereDate('date', $date)
                ->get();

            $last7Days->push([
                'date' => $date->format('d/m'),
                'day' => $date->translatedFormat('D'),
                'hadir' => $dayAttendances->where('status', 'hadir')->count(),
                'hampir_terlambat' => $dayAttendances->where('status', 'hampir_terlambat')->count(),
                'terlambat' => $dayAttendances->where('status', 'terlambat')->count(),
            ]);
        }

        // Status distribution for current month (for Donut Chart)
        $monthAttendances = Attendance::whereIn('user_id', $subordinateIds)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        $statusDistribution = [
            ['name' => 'Hadir', 'value' => $monthAttendances->where('status', 'hadir')->count(), 'color' => '#10B981'],
            ['name' => 'Hampir Terlambat', 'value' => $monthAttendances->where('status', 'hampir_terlambat')->count(), 'color' => '#F59E0B'],
            ['name' => 'Terlambat', 'value' => $monthAttendances->where('status', 'terlambat')->count(), 'color' => '#EF4444'],
        ];

        // Pending leave requests
        $pendingLeaves = Leave::whereIn('user_id', $subordinateIds)
            ->where('status', 'pending')
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Supervisor/Team', [
            'teamMembers' => $teamMembers,
            'attendanceChart' => $last7Days,
            'statusDistribution' => $statusDistribution,
            'pendingLeaves' => $pendingLeaves,
        ]);
    }

    /**
     * Approve a leave request.
     */
    public function approveLeave(Request $request, Leave $leave)
    {
        $user = $request->user();

        // Verify supervisor owns the team member (Skip if Admin)
        if (!$user->hasRole('admin')) {
            $subordinateIds = $user->subordinates()->pluck('id');
            if (!$subordinateIds->contains($leave->user_id)) {
                abort(403, 'Anda tidak memiliki akses untuk menyetujui izin ini.');
            }
        }

        if (!$leave->isPending()) {
            return back()->withErrors(['leave' => 'Izin ini sudah diproses.']);
        }

        $leave->update([
            'status' => 'approved',
            'approved_by' => $user->id,
        ]);

        return back()->with('success', 'Izin berhasil disetujui.');
    }

    /**
     * Reject a leave request.
     */
    public function rejectLeave(Request $request, Leave $leave)
    {
        $user = $request->user();

        // Verify supervisor owns the team member (Skip if Admin)
        if (!$user->hasRole('admin')) {
            $subordinateIds = $user->subordinates()->pluck('id');
            if (!$subordinateIds->contains($leave->user_id)) {
                abort(403, 'Anda tidak memiliki akses untuk menolak izin ini.');
            }
        }

        if (!$leave->isPending()) {
            return back()->withErrors(['leave' => 'Izin ini sudah diproses.']);
        }

        $leave->update([
            'status' => 'rejected',
            'approved_by' => $user->id,
        ]);

        return back()->with('success', 'Izin berhasil ditolak.');
    }
}
