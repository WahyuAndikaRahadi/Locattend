<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Leave;
use App\Models\User;
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

        $teamMembers = $user->subordinates()
            ->with('office')
            ->select('id', 'name', 'email', 'office_id')
            ->get()
            ->map(function ($member) {
                $todayAttendance = $member->attendances()
                    ->whereDate('date', today())
                    ->first();
                
                if ($todayAttendance) {
                    $member->today_status = 'hadir';
                } else {
                    // Check for approved leave
                    $approvedLeave = Leave::where('user_id', $member->id)
                        ->where('status', 'approved')
                        ->whereDate('start_date', '<=', today())
                        ->whereDate('end_date', '>=', today())
                        ->first();
                    
                    if ($approvedLeave) {
                        $member->today_status = 'izin';
                    } elseif ($member->office && !$member->office->isWorkingDay(today())) {
                        $member->today_status = 'libur';
                    } else {
                        $member->today_status = 'alpha';
                    }
                }
                return $member;
            });

        $last7Days = collect();
        $totalTeam = $subordinateIds->count();

        $totalTeam = $subordinateIds->count();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayAttendances = Attendance::whereIn('user_id', $subordinateIds)
                ->whereDate('date', $date)
                ->where('status', 'hadir')
                ->count();
            
            $dayLeavesCount = Leave::whereIn('user_id', $subordinateIds)
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', $date)
                ->whereDate('end_date', '>=', $date)
                ->count();

            // Calculate alpha only for those supposed to work today
            $expectedToWorkCount = User::whereIn('id', $subordinateIds)
                ->get()
                ->filter(function($u) use ($date) {
                    return !$u->office || $u->office->isWorkingDay($date);
                })->count();

            $alpha = max(0, $expectedToWorkCount - $dayAttendances - $dayLeavesCount);

            $last7Days->push([
                'date' => $date->format('d/m'),
                'day' => $date->translatedFormat('D'),
                'hadir' => $dayAttendances,
                'izin' => $dayLeavesCount,
                'alpha' => $alpha,
            ]);
        }

        $monthAttendances = Attendance::whereIn('user_id', $subordinateIds)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();
        
        $monthLeavesCount = Leave::whereIn('user_id', $subordinateIds)
            ->where('status', 'approved')
            ->whereMonth('start_date', '<=', now()->month)
            ->count();

        // For status distribution, we need to calculate alpha across the month correctly
        $totalAlpha = 0;
        $totalHadir = Attendance::whereIn('user_id', $subordinateIds)->whereMonth('date', now()->month)->whereYear('date', now()->year)->count();
        
        // Accurate month-to-date alpha calculation
        $subordinatesData = User::whereIn('id', $subordinateIds)->with('office')->get();
        for ($d = 1; $d <= now()->day; $d++) {
            $currentDate = now()->copy()->day($d);
            
            foreach ($subordinatesData as $member) {
                // Skip if not a working day
                if ($member->office && !$member->office->isWorkingDay($currentDate)) continue;

                // Check attendance
                $hasAttended = Attendance::where('user_id', $member->id)->whereDate('date', $currentDate)->exists();
                if ($hasAttended) continue;

                // Check leave
                $isOnLeave = Leave::where('user_id', $member->id)
                    ->where('status', 'approved')
                    ->whereDate('start_date', '<=', $currentDate)
                    ->whereDate('end_date', '>=', $currentDate)
                    ->exists();
                if ($isOnLeave) continue;

                $totalAlpha++;
            }
        }

        $statusDistribution = [
            ['name' => 'Hadir', 'value' => $totalHadir, 'color' => '#10B981'],
            ['name' => 'Izin', 'value' => $monthLeavesCount, 'color' => '#F59E0B'],
            ['name' => 'Alpha', 'value' => $totalAlpha, 'color' => '#64748b'],
        ];

        return Inertia::render('Supervisor/Team', [
            'teamMembers' => $teamMembers,
            'attendanceChart' => $last7Days,
            'statusDistribution' => $statusDistribution,
        ]);
    }

    /**
     * Show schedule/jadwal page with daily and monthly views.
     */
    public function schedule(Request $request)
    {
        $user = $request->user();
        $subordinates = $user->subordinates()->select('id', 'name', 'email', 'office_id')->with('office:id,working_hour_start,working_days')->get();
        $subordinateIds = $subordinates->pluck('id');

        // ========== DAILY VIEW ==========
        $selectedDate = $request->input('date', today()->format('Y-m-d'));
        $date = Carbon::parse($selectedDate);

        $dailyAttendances = Attendance::whereIn('user_id', $subordinateIds)
            ->whereDate('date', $date)
            ->get()
            ->keyBy('user_id');

        $dailyLeaves = Leave::whereIn('user_id', $subordinateIds)
            ->where('status', 'approved')
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->get()
            ->keyBy('user_id');

        $dailyData = $subordinates->map(function ($member) use ($dailyAttendances, $dailyLeaves, $date) {
            $attendance = $dailyAttendances->get($member->id);
            $leave = $dailyLeaves->get($member->id);

            $isLate = false;
            if ($attendance && $member->office && $member->office->working_hour_start) {
                $clockIn = Carbon::parse($attendance->clock_in_time);
                $startTime = Carbon::parse($member->office->working_hour_start);
                $isLate = $clockIn->greaterThan($startTime);
            }

            if ($attendance) {
                $status = 'hadir';
            } elseif ($leave) {
                $status = 'izin';
            } elseif ($member->office && !$member->office->isWorkingDay($date)) {
                $status = 'libur';
            } else {
                $status = 'alpha';
            }

            return [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'status' => $status,
                'clock_in_time' => $attendance?->clock_in_time,
                'is_late' => $isLate,
                'leave_reason' => $leave?->reason,
            ];
        });

        // ========== MONTHLY VIEW ==========
        $selectedMonth = $request->input('month', now()->format('Y-m'));
        $monthDate = Carbon::parse($selectedMonth . '-01');
        $daysInMonth = $monthDate->copy()->endOfMonth()->day;
        $maxDay = $monthDate->isSameMonth(now()) ? now()->day : $daysInMonth;

        $monthlyData = $subordinates->map(function ($member) use ($monthDate, $maxDay) {
            $attendances = Attendance::where('user_id', $member->id)
                ->whereYear('date', $monthDate->year)
                ->whereMonth('date', $monthDate->month)
                ->get();

            $hadirCount = $attendances->count();

            $lateCount = 0;
            if ($member->office && $member->office->working_hour_start) {
                $startTime = Carbon::parse($member->office->working_hour_start);
                $lateCount = $attendances->filter(function ($a) use ($startTime) {
                    return $a->clock_in_time && Carbon::parse($a->clock_in_time)->greaterThan($startTime);
                })->count();
            }

            // Count leave days that overlap with this month
            $leaves = Leave::where('user_id', $member->id)
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', $monthDate->copy()->endOfMonth())
                ->whereDate('end_date', '>=', $monthDate->copy()->startOfMonth())
                ->get();

            $alphaCount = 0;
            $liburCount = 0;
            $izinCount = 0;
            for ($d = 1; $d <= $maxDay; $d++) {
                $currentDate = $monthDate->copy()->day($d);
                
                // Check if attended
                $hasAttended = $attendances->contains(function($a) use ($currentDate) {
                    return Carbon::parse($a->date)->isSameDay($currentDate);
                });
                
                if ($hasAttended) continue;

                // Check if on leave
                $isOnLeave = $leaves->contains(function($l) use ($currentDate) {
                    return $currentDate->between(Carbon::parse($l->start_date)->startOfDay(), Carbon::parse($l->end_date)->endOfDay());
                });

                if ($isOnLeave) {
                    $izinCount++;
                    continue;
                }

                // Check if working day
                if ($member->office && !$member->office->isWorkingDay($currentDate)) {
                    $liburCount++;
                    continue;
                }

                $alphaCount++;
            }

            return [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'hadir' => $hadirCount,
                'izin' => $izinCount,
                'alpha' => $alphaCount,
                'libur' => $liburCount,
                'terlambat' => $lateCount,
            ];
        });

        return Inertia::render('Supervisor/Schedule', [
            'dailyData' => $dailyData,
            'monthlyData' => $monthlyData,
            'selectedDate' => $selectedDate,
            'selectedMonth' => $selectedMonth,
            'totalMembers' => $subordinateIds->count(),
        ]);
    }

    /**
     * Show the supervisor leave management page.
     */
    public function leaves(Request $request)
    {
        $user = $request->user();
        $subordinateIds = $user->subordinates()->pluck('id');

        $pendingLeaves = Leave::whereIn('user_id', $subordinateIds)
            ->where('status', 'pending')
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        $processedLeaves = Leave::whereIn('user_id', $subordinateIds)
            ->whereIn('status', ['approved', 'rejected'])
            ->with('user:id,name,email')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get();

        return Inertia::render('Supervisor/Leaves', [
            'pendingLeaves' => $pendingLeaves,
            'processedLeaves' => $processedLeaves,
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
