<?php

namespace App\Http\Controllers\Admin;

use App\Models\Office;
use App\Models\WorkSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkScheduleController
{
    /**
     * Show work schedule management page.
     */
    public function index(Request $request)
    {
        $offices = Office::with('workSchedule')->get();

        return Inertia::render('Admin/WorkSchedules/Index', [
            'offices' => $offices,
        ]);
    }

    /**
     * Update or create work schedule for an office.
     */
    public function store(Request $request)
    {
        $request->validate([
            'office_id' => 'required|exists:offices,id',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time' => 'required|date_format:H:i|after:clock_in_time',
        ]);

        $office = Office::findOrFail($request->office_id);

        // Create or update work schedule
        WorkSchedule::updateOrCreate(
            ['office_id' => $office->id],
            [
                'clock_in_time' => $request->clock_in_time . ':00',
                'clock_out_time' => $request->clock_out_time . ':00',
            ]
        );

        return back()->with('success', "Jadwal kerja untuk kantor '{$office->name}' berhasil disimpan!");
    }

    /**
     * Delete work schedule.
     */
    public function destroy(Request $request, WorkSchedule $workSchedule)
    {
        $officeName = $workSchedule->office->name;
        $workSchedule->delete();

        return back()->with('success', "Jadwal kerja untuk kantor '{$officeName}' berhasil dihapus!");
    }
}
