<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Attendance;
use App\Models\Leave;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $users = User::with(['roles', 'office:id,name', 'supervisor:id,name'])
            ->when($request->search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($query, $role) {
                $query->role($role);
            })
            ->when($request->office_id, function ($query, $officeId) {
                $query->where('office_id', $officeId);
            })
            ->when($request->supervisor_id, function ($query, $supervisorId) {
                $query->where('supervisor_id', $supervisorId);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        // User Statistics
        $stats = [
            'total' => User::count(),
            'admins' => User::role('admin')->count(),
            'supervisors' => User::role('supervisor')->count(),
            'karyawan' => User::role('karyawan')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'office_id', 'supervisor_id']),
            'stats' => $stats,
            'offices' => Office::all(['id', 'name']),
            'roles' => Role::all(['id', 'name']),
            'supervisors' => User::role('supervisor')->get(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all()->pluck('name'),
            'offices' => Office::all(['id', 'name']),
            'supervisors' => User::role('supervisor')->get(['id', 'name', 'office_id']),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'office_id' => 'nullable|exists:offices,id',
            'supervisor_id' => 'nullable|exists:users,id',
        ]);

        $supervisor_id = $request->supervisor_id;
        // Auto-clear manager if role is admin or supervisor
        if (in_array($request->role, ['admin', 'supervisor'])) {
            $supervisor_id = null;
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'office_id' => $request->office_id,
            'supervisor_id' => $supervisor_id,
            'email_verified_at' => now(),
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Show the form for editing a user.
     */
    public function edit(User $user)
    {
        $user->load('roles');

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'currentRole' => $user->roles->first()?->name,
            'roles' => Role::all()->pluck('name'),
            'offices' => Office::all(['id', 'name']),
            'supervisors' => User::role('supervisor')->where('id', '!=', $user->id)->get(['id', 'name', 'office_id']),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|exists:roles,name',
            'office_id' => 'nullable|exists:offices,id',
            'supervisor_id' => 'nullable|exists:users,id',
        ]);

        $supervisor_id = $request->supervisor_id;
        // Auto-clear manager if role is admin or supervisor
        if (in_array($request->role, ['admin', 'supervisor'])) {
            $supervisor_id = null;
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'office_id' => $request->office_id,
            'supervisor_id' => $supervisor_id,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $user->syncRoles([$request->role]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil diperbarui.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['user' => 'Anda tidak dapat menghapus akun sendiri.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User berhasil dihapus.');
    }

    /**
     * Dashboard Tim untuk Admin (Memantau semua Supervisor)
     */
    public function team(Request $request)
    {
        // Ambil semua user dengan role 'supervisor'
        $supervisors = User::role('supervisor')->with('office')->get(['id', 'name', 'email', 'office_id']);
        $supervisorIds = $supervisors->pluck('id');

        // Status hari ini untuk masing-masing supervisor
        $teamMembers = $supervisors->map(function ($member) {
            $todayAttendance = Attendance::where('user_id', $member->id)
                ->whereDate('date', today())
                ->first();
            
            if ($todayAttendance) {
                $member->today_status = 'hadir';
                $member->clock_in = $todayAttendance->clock_in_time;
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

        // Data absensi 7 hari terakhir (Bar Chart) - Gabungan semua supervisor
        $last7Days = collect();
        $totalSupervisors = $supervisorIds->count();

        $totalSupervisors = $supervisorIds->count();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayAttendances = Attendance::whereIn('user_id', $supervisorIds)
                ->whereDate('date', $date)
                ->where('status', 'hadir')
                ->count();
            
            $dayLeavesCount = Leave::whereIn('user_id', $supervisorIds)
                ->where('status', 'approved')
                ->whereDate('start_date', '<=', $date)
                ->whereDate('end_date', '>=', $date)
                ->count();

            // Calculate alpha only for those supposed to work today
            $expectedToWorkCount = User::whereIn('id', $supervisorIds)
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

        // Distribusi status bulan ini (Donut Chart)
        $monthAttendances = Attendance::whereIn('user_id', $supervisorIds)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();
        
        $monthLeavesCount = Leave::whereIn('user_id', $supervisorIds)
            ->where('status', 'approved')
            ->whereMonth('start_date', '<=', now()->month)
            ->count();

        // For status distribution, we need to calculate alpha across the month correctly
        $totalAlpha = 0;
        $totalHadir = Attendance::whereIn('user_id', $supervisorIds)->whereMonth('date', now()->month)->whereYear('date', now()->year)->count();
        
        // Accurate month-to-date alpha calculation
        $supervisorsData = User::whereIn('id', $supervisorIds)->with('office')->get();
        for ($d = 1; $d <= now()->day; $d++) {
            $currentDate = now()->copy()->day($d);
            
            foreach ($supervisorsData as $member) {
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
            ['name' => 'Hadir', 'value' => $totalHadir, 'color' => '#3b82f6'],
            ['name' => 'Izin', 'value' => $monthLeavesCount, 'color' => '#f59e0b'],
            ['name' => 'Alpha', 'value' => $totalAlpha, 'color' => '#64748b'],
        ];

        // Pengajuan izin pending dari para Supervisor
        $pendingLeaves = Leave::whereIn('user_id', $supervisorIds)
            ->where('status', 'pending')
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Team/Index', [
            'teamMembers' => $teamMembers,
            'attendanceChart' => $last7Days,
            'statusDistribution' => $statusDistribution,
            'pendingLeaves' => $pendingLeaves,
        ]);
    }

    /**
     * Display all leave requests from Supervisors.
     */
    public function leaves(Request $request)
    {
        $supervisors = User::role('supervisor')->pluck('id');
        
        $pendingLeaves = Leave::whereIn('user_id', $supervisors)
            ->where('status', 'pending')
            ->with('user:id,name,email')
            ->orderByDesc('created_at')
            ->get();

        $processedLeaves = Leave::whereIn('user_id', $supervisors)
            ->where('status', '!=', 'pending')
            ->with('user:id,name,email')
            ->orderByDesc('updated_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Leaves/Index', [
            'pendingLeaves' => $pendingLeaves,
            'processedLeaves' => $processedLeaves,
        ]);
    }

    /**
     * Tampilkan jadwal absensi (Harian/Bulanan) untuk SEMUA karyawan & supervisor.
     */
    public function schedule(Request $request)
    {
        $office_id = $request->input('office_id');

        // Get non-admin users with optional office filter
        $users = User::role(['karyawan', 'supervisor'])
            ->select('id', 'name', 'email', 'office_id')
            ->when($office_id, function ($query, $officeId) {
                $query->where('office_id', $officeId);
            })
            ->with(['office:id,name,working_hour_start,working_days'])
            ->get();
        
        $userIds = $users->pluck('id');

        // ========== DAILY VIEW ==========
        $selectedDate = $request->input('date', today()->format('Y-m-d'));
        $date = Carbon::parse($selectedDate);

        $dailyAttendances = Attendance::whereIn('user_id', $userIds)
            ->whereDate('date', $date)
            ->get()
            ->keyBy('user_id');

        $dailyLeaves = Leave::whereIn('user_id', $userIds)
            ->where('status', 'approved')
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date)
            ->get()
            ->keyBy('user_id');

        $dailyData = $users->map(function ($member) use ($dailyAttendances, $dailyLeaves, $date) {
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
        
        // Count max days up to current day if we're in the current month
        $maxDay = $monthDate->isSameMonth(now()) ? now()->day : $daysInMonth;

        $monthlyData = $users->map(function ($member) use ($monthDate, $maxDay) {
            $attendances = Attendance::where('user_id', $member->id)
                ->whereYear('date', $monthDate->year)
                ->whereMonth('date', $monthDate->month)
                ->get();

            $hadirCount = $attendances->count();

            // Check how many times they were late
            $lateCount = 0;
            if ($member->office && $member->office->working_hour_start) {
                $startTime = Carbon::parse($member->office->working_hour_start);
                $lateCount = $attendances->filter(function ($a) use ($startTime) {
                    return $a->clock_in_time && Carbon::parse($a->clock_in_time)->greaterThan($startTime);
                })->count();
            }

            // Count approved leaves crossing this month
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

        return Inertia::render('Admin/Schedule', [
            'dailyData' => $dailyData,
            'monthlyData' => $monthlyData,
            'selectedDate' => $selectedDate,
            'selectedMonth' => $selectedMonth,
            'totalMembers' => $userIds->count(),
            'offices' => Office::all(['id', 'name'])->values(),
            'filters' => $request->only(['office_id']),
        ]);
    }
}
