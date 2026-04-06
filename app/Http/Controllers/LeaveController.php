<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Display leave requests for the authenticated user.
     */
    public function index(Request $request)
    {
        $leaves = $request->user()
            ->leaves()
            ->with('approver:id,name')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Leave/Index', [
            'leaves' => $leaves,
        ]);
    }

    /**
     * Show the leave request form.
     */
    public function create()
    {
        return Inertia::render('Leave/Create');
    }

    /**
     * Store a new leave request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'leave_type' => 'required|in:izin,cuti',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
        ]);

        $request->user()->leaves()->create([
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('leaves.index')
            ->with('success', 'Pengajuan izin berhasil dikirim.');
    }
}
