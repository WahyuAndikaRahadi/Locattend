<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'clock_in_time',
        'clock_out_time',
        'duration_minutes',
        'work_report',
        'status',
        'is_late',
        'late_minutes',
        'lat_in',
        'long_in',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'lat_in' => 'decimal:7',
            'long_in' => 'decimal:7',
            'is_late' => 'boolean',
        ];
    }

    /**
     * Get the user that owns this attendance record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if attendance is complete (has clock out).
     */
    public function isComplete(): bool
    {
        return $this->clock_out_time !== null && $this->work_report !== null;
    }

    /**
     * Get formatted duration (e.g., "8 jam 30 menit").
     */
    public function getFormattedDurationAttribute(): ?string
    {
        if (!$this->duration_minutes) {
            return null;
        }

        $hours = intdiv($this->duration_minutes, 60);
        $minutes = $this->duration_minutes % 60;

        $parts = [];
        if ($hours > 0) {
            $parts[] = $hours . ' jam';
        }
        if ($minutes > 0) {
            $parts[] = $minutes . ' menit';
        }

        return implode(' ', $parts) ?: '0 menit';
    }

    /**
     * Get status with late badge if applicable.
     */
    public function getStatusBadgeAttribute(): string
    {
        if ($this->is_late) {
            return "Terlambat – {$this->late_minutes} menit";
        }
        return 'Tepat Waktu';
    }
}
