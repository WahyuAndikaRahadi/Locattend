<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeController extends Controller
{
    /**
     * Display a listing of offices.
     */
    public function index(Request $request)
    {
        $offices = Office::withCount('users')->with('workSchedule')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        $stats = [
            'total' => Office::count(),
            'avg_radius' => round(Office::avg('radius_meters') ?? 0),
        ];

        return Inertia::render('Admin/Offices/Index', [
            'offices' => $offices,
            'stats' => $stats,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new office.
     */
    public function create()
    {
        return Inertia::render('Admin/Offices/Create');
    }

    /**
     * Store a newly created office.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius_meters' => 'required|integer|min:10|max:10000',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time' => 'required|date_format:H:i|after:clock_in_time',
            'working_days' => 'required|array|min:1',
        ]);

        $office = Office::create($request->only(['name', 'latitude', 'longitude', 'radius_meters', 'working_days']));

        $office->workSchedule()->create([
            'clock_in_time' => $request->clock_in_time . ':00',
            'clock_out_time' => $request->clock_out_time . ':00',
        ]);

        return redirect()->route('admin.offices.index')
            ->with('success', 'Kantor berhasil ditambahkan.');
    }

    /**
     * Show the form for editing an office.
     */
    public function edit(Office $office)
    {
        return Inertia::render('Admin/Offices/Edit', [
            'office' => $office->load('workSchedule'),
        ]);
    }

    /**
     * Update the specified office.
     */
    public function update(Request $request, Office $office)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius_meters' => 'required|integer|min:10|max:10000',
            'clock_in_time' => 'required|date_format:H:i',
            'clock_out_time' => 'required|date_format:H:i|after:clock_in_time',
            'working_days' => 'required|array|min:1',
        ]);

        $office->update($request->only(['name', 'latitude', 'longitude', 'radius_meters', 'working_days']));

        $office->workSchedule()->updateOrCreate(
            ['office_id' => $office->id],
            [
                'clock_in_time' => $request->clock_in_time . ':00',
                'clock_out_time' => $request->clock_out_time . ':00',
            ]
        );

        return redirect()->route('admin.offices.index')
            ->with('success', 'Data kantor berhasil diperbarui.');
    }

    /**
     * Remove the specified office.
     */
    public function destroy(Office $office)
    {
        if ($office->users()->count() > 0) {
            return back()->withErrors(['office' => 'Kantor tidak dapat dihapus karena masih memiliki karyawan.']);
        }

        $office->delete();

        return redirect()->route('admin.offices.index')
            ->with('success', 'Kantor berhasil dihapus.');
    }
}
