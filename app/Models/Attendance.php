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
        'status',
        'lat_in',
        'long_in',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'lat_in' => 'decimal:7',
            'long_in' => 'decimal:7',
        ];
    }

    /**
     * Get the user that owns this attendance record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
