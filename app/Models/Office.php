<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Office extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'radius_meters',
        'working_hour_start',
        'working_days',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'radius_meters' => 'integer',
            'working_days' => 'array',
        ];
    }

    /**
     * Get the users assigned to this office.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if given coordinates are within the geofence radius using Haversine formula.
     *
     * @param float $lat Latitude of the point to check
     * @param float $lng Longitude of the point to check
     * @return bool
     */
    public function isWithinRadius(float $lat, float $lng): bool
    {
        $distance = $this->calculateDistance($lat, $lng);
        return $distance <= $this->radius_meters;
    }

    /**
     * Calculate distance in meters between office and given coordinates using Haversine formula.
     *
     * @param float $lat
     * @param float $lng
     * @return float Distance in meters
     */
    public function calculateDistance(float $lat, float $lng): float
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $latFrom = deg2rad($this->latitude);
        $lngFrom = deg2rad($this->longitude);
        $latTo = deg2rad($lat);
        $lngTo = deg2rad($lng);

        $latDiff = $latTo - $latFrom;
        $lngDiff = $lngTo - $lngFrom;

        $a = sin($latDiff / 2) ** 2 +
             cos($latFrom) * cos($latTo) *
             sin($lngDiff / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Check if the given date is a working day for this office.
     *
     * @param mixed $date Carbon instance or date string
     * @return bool
     */
    public function isWorkingDay($date): bool
    {
        // Default to Mon-Sat (1,2,3,4,5,6) if null
        $workingDays = $this->working_days ?? [1, 2, 3, 4, 5, 6];
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;
        return in_array($dayOfWeek, $workingDays);
    }
}
