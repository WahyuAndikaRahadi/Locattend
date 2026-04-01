<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Office;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $office = Office::first();

        // Create Admin
        $admin = User::create([
            'name' => 'Admin Locattend',
            'email' => 'admin@locattend.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'office_id' => $office->id,
        ]);
        $admin->assignRole('admin');

        // Create Supervisor
        $supervisor = User::create([
            'name' => 'Budi Supervisor',
            'email' => 'supervisor@locattend.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'office_id' => $office->id,
        ]);
        $supervisor->assignRole('supervisor');

        // Create Employees under the supervisor
        $employees = [
            ['name' => 'Andi Karyawan', 'email' => 'andi@locattend.com'],
            ['name' => 'Siti Karyawan', 'email' => 'siti@locattend.com'],
            ['name' => 'Rudi Karyawan', 'email' => 'rudi@locattend.com'],
        ];

        foreach ($employees as $emp) {
            $user = User::create([
                'name' => $emp['name'],
                'email' => $emp['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'supervisor_id' => $supervisor->id,
                'office_id' => $office->id,
            ]);
            $user->assignRole('karyawan');
        }
    }
}
