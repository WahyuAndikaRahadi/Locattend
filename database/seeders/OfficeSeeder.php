<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Seeder;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Office::create([
            'name' => 'Kantor Pusat Jakarta',
            'latitude' => -6.1751000,
            'longitude' => 106.8650000,
            'radius_meters' => 200,
        ]);
    }
}
