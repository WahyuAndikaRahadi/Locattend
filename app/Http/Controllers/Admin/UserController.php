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
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
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
            'filters' => $request->only('search'),
            'stats' => $stats,
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
            'supervisors' => User::role('supervisor')->get(['id', 'name']),
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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'office_id' => $request->office_id,
            'supervisor_id' => $request->supervisor_id,
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
            'supervisors' => User::role('supervisor')->where('id', '!=', $user->id)->get(['id', 'name']),
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

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'office_id' => $request->office_id,
            'supervisor_id' => $request->supervisor_id,
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
        $supervisors = User::role('supervisor')->get(['id', 'name', 'email']);
        $supervisorIds = $supervisors->pluck('id');

        // Status hari ini untuk masing-masing supervisor
        $teamMembers = $supervisors->map(function ($member) {
            $todayAttendance = Attendance::where('user_id', $member->id)
                ->whereDate('date', today())
                ->first();
            $member->today_status = $todayAttendance ? $todayAttendance->status : 'belum_absen';
            return $member;
        });

        // Data absensi 7 hari terakhir (Bar Chart) - Gabungan semua supervisor
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayAttendances = Attendance::whereIn('user_id', $supervisorIds)
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

        // Distribusi status bulan ini (Donut Chart)
        $monthAttendances = Attendance::whereIn('user_id', $supervisorIds)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        $statusDistribution = [
            ['name' => 'Hadir', 'value' => $monthAttendances->where('status', 'hadir')->count(), 'color' => '#3b82f6'],
            ['name' => 'Hampir Terlambat', 'value' => $monthAttendances->where('status', 'hampir_terlambat')->count(), 'color' => '#f59e0b'],
            ['name' => 'Terlambat', 'value' => $monthAttendances->where('status', 'terlambat')->count(), 'color' => '#ef4444'],
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
}
