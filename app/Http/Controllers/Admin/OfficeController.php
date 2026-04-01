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
    public function index()
    {
        $offices = Office::withCount('users')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Admin/Offices/Index', [
            'offices' => $offices,
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
        ]);

        Office::create($request->only(['name', 'latitude', 'longitude', 'radius_meters']));

        return redirect()->route('admin.offices.index')
            ->with('success', 'Kantor berhasil ditambahkan.');
    }

    /**
     * Show the form for editing an office.
     */
    public function edit(Office $office)
    {
        return Inertia::render('Admin/Offices/Edit', [
            'office' => $office,
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
        ]);

        $office->update($request->only(['name', 'latitude', 'longitude', 'radius_meters']));

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
