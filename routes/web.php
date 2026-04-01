<?php

use App\Http\Controllers\Admin\OfficeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SupervisorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (role-based)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Attendance routes (karyawan + supervisor can clock-in)
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('attendance.clockIn');
    Route::get('/attendance/history', [AttendanceController::class, 'history'])->name('attendance.history');

    // Leave routes (karyawan + supervisor can submit leaves)
    Route::resource('leaves', LeaveController::class)->only(['index', 'create', 'store']);

    // Supervisor routes
    Route::middleware('role:supervisor|admin')->prefix('supervisor')->name('supervisor.')->group(function () {
        Route::get('/team', [SupervisorController::class, 'team'])->name('team');
        Route::post('/leaves/{leave}/approve', [SupervisorController::class, 'approveLeave'])->name('leaves.approve');
        Route::post('/leaves/{leave}/reject', [SupervisorController::class, 'rejectLeave'])->name('leaves.reject');
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('offices', OfficeController::class);
    });
});

require __DIR__.'/auth.php';
