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
        $user->load('office');

        $todayAttendance = $user->attendances()
            ->whereDate('date', today())
            ->first();

        $recentAttendances = $user->attendances()
            ->orderByDesc('date')
            ->limit(10)
            ->get();

        return Inertia::render('Attendance/Index', [
            'office' => $user->office,
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    /**
     * Process clock-in with GPS validation.
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $user = $request->user();
        $user->load('office');

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

        // Determine attendance status based on office start time
        $now = Carbon::now('Asia/Jakarta');
        $clockInTime = $now->format('H:i:s');

        // Note: 'terlambat' status is removed as per user request. 
        // All successful clock-ins are marked 'hadir'.
        Attendance::create([
            'user_id' => $user->id,
            'date' => today(),
            'clock_in_time' => $clockInTime,
            'status' => 'hadir',
            'lat_in' => $lat,
            'long_in' => $lng,
        ]);

        $statusLabels = [
            'hadir' => 'Hadir',
        ];

        return back()->with('success', "Absensi berhasil! Status: {$statusLabels[$status]} ({$clockInTime})");
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
