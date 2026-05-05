<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Show the clock-in page.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $user->load('office.workSchedule');

        $todayAttendance = $user->attendances()
            ->whereDate('date', today())
            ->first();

        $recentAttendances = $user->attendances()
            ->orderByDesc('date')
            ->limit(30)
            ->get();

        return Inertia::render('Attendance/Index', [
            'office' => $user->office,
            'workSchedule' => $user->office?->workSchedule,
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    /**
     * Process clock-in with GPS validation and late detection.
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $user = $request->user();
        $user->load('office.workSchedule');

        // Check if user has an assigned office
        if (!$user->office) {
            return back()->withErrors(['office' => 'Anda belum ditugaskan ke kantor manapun. Hubungi admin.']);
        }

        // Check if already clocked in today
        $existingAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
            ->first();

        if ($existingAttendance) {
            return back()->withErrors(['attendance' => 'Anda sudah melakukan absensi hari ini.']);
        }

        // BACKEND SECURITY: Validate GPS using Haversine formula
        $lat = $request->latitude;
        $lng = $request->longitude;
        $office = $user->office;

        if (!$office->isWithinRadius($lat, $lng)) {
            $distance = round($office->calculateDistance($lat, $lng));
            return back()->withErrors([
                'location' => "Anda berada di luar radius kantor. Jarak Anda: {$distance}m (Radius: {$office->radius_meters}m)."
            ]);
        }

        // Get current time (using server timezone)
        $now = Carbon::now('Asia/Jakarta');
        $clockInTime = $now->format('H:i:s');

        // Detect if late
        $isLate = false;
        $lateMinutes = 0;

        if ($office->workSchedule) {
            $scheduleClockInTime = Carbon::createFromTimeString($office->workSchedule->clock_in_time, 'Asia/Jakarta');
            $nowTime = $now->setTimeFromTimeString($clockInTime, 'Asia/Jakarta');

            if ($nowTime->isAfter($scheduleClockInTime)) {
                $isLate = true;
                $lateMinutes = $nowTime->diffInMinutes($scheduleClockInTime);
            }
        }

        // Create attendance record
        Attendance::create([
            'user_id' => $user->id,
            'date' => today(),
            'clock_in_time' => $clockInTime,
            'status' => 'hadir',
            'lat_in' => $lat,
            'long_in' => $lng,
            'is_late' => $isLate,
            'late_minutes' => $lateMinutes,
        ]);

        $statusLabel = $isLate ? "Terlambat ({$lateMinutes} menit)" : 'Tepat Waktu';

        return back()->with('success', "Absensi masuk berhasil! Status: {$statusLabel} ({$clockInTime})");
    }

    /**
     * Check if user can clock out (guard: time must be >= clock_out_time).
     * This is a server-side validation endpoint.
     */
    public function canClockOut(Request $request)
    {
        $user = $request->user();
        $user->load('office.workSchedule');

        $todayAttendance = $user->attendances()
            ->whereDate('date', today())
            ->first();

        // Check if clocked in
        if (!$todayAttendance) {
            return response()->json(['canClockOut' => false, 'message' => 'Anda belum clock in hari ini.']);
        }

        // Check if already clocked out
        if ($todayAttendance->clock_out_time) {
            return response()->json(['canClockOut' => false, 'message' => 'Anda sudah clock out hari ini.']);
        }

        // Check if work schedule exists
        if (!$user->office?->workSchedule) {
            return response()->json(['canClockOut' => true, 'message' => 'Jadwal kerja belum diatur.']);
        }

        $now = Carbon::now('Asia/Jakarta');
        $scheduleClockOutTime = Carbon::createFromTimeString($user->office->workSchedule->clock_out_time, 'Asia/Jakarta');

        // Compare times
        if ($now->isBefore($scheduleClockOutTime)) {
            $minutesUntilClockOut = $now->diffInMinutes($scheduleClockOutTime);
            return response()->json([
                'canClockOut' => false,
                'message' => "Clock out baru bisa dilakukan setelah pukul {$scheduleClockOutTime->format('H:i')}. Tunggu {$minutesUntilClockOut} menit lagi.",
                'clockOutTime' => $scheduleClockOutTime->format('H:i'),
            ]);
        }

        return response()->json(['canClockOut' => true, 'message' => 'Anda bisa clock out sekarang.']);
    }

    /**
     * Process clock-out with work report.
     */
    public function clockOut(Request $request)
    {
        $request->validate([
            'work_report' => 'required|string|min:20|max:1000',
        ]);

        $user = $request->user();
        $user->load('office.workSchedule');

        // Get today's attendance
        $attendance = $user->attendances()
            ->whereDate('date', today())
            ->first();

        if (!$attendance) {
            return back()->withErrors(['attendance' => 'Anda belum clock in hari ini.']);
        }

        if ($attendance->clock_out_time) {
            return back()->withErrors(['attendance' => 'Anda sudah clock out hari ini.']);
        }

        // BACKEND SECURITY: Check if time is valid for clock out
        if ($user->office?->workSchedule) {
            $now = Carbon::now('Asia/Jakarta');
            $scheduleClockOutTime = Carbon::createFromTimeString($user->office->workSchedule->clock_out_time, 'Asia/Jakarta');

            if ($now->isBefore($scheduleClockOutTime)) {
                return back()->withErrors([
                    'time' => "Clock out hanya bisa dilakukan setelah pukul {$scheduleClockOutTime->format('H:i')}."
                ]);
            }
        }

        // Calculate duration
        $now = Carbon::now('Asia/Jakarta');
        $clockOutTime = $now->format('H:i:s');

        $clockInCarbon = Carbon::createFromTimeString($attendance->clock_in_time, 'Asia/Jakarta');
        $clockOutCarbon = $now->setTimeFromTimeString($clockOutTime, 'Asia/Jakarta');
        $durationMinutes = $clockInCarbon->diffInMinutes($clockOutCarbon);

        // Update attendance
        $attendance->update([
            'clock_out_time' => $clockOutTime,
            'duration_minutes' => $durationMinutes,
            'work_report' => $request->work_report,
        ]);

        $hours = intdiv($durationMinutes, 60);
        $minutes = $durationMinutes % 60;
        $durationText = "{$hours} jam " . ($minutes > 0 ? "{$minutes} menit" : "");

        return back()->with('success', "Clock out berhasil! Durasi kerja: {$durationText}");
    }

    /**
     * Show attendance history.
     */
    public function history(Request $request)
    {
        $user = $request->user();

        $attendances = $user->attendances()
            ->orderByDesc('date')
            ->paginate(20);

        return Inertia::render('Attendance/History', [
            'attendances' => $attendances,
        ]);
    }
}
