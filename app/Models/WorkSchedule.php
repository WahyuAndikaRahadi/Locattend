<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'office_id',
        'clock_in_time',
        'clock_out_time',
    ];

    protected function casts(): array
    {
        return [
            'clock_in_time' => 'datetime:H:i',
            'clock_out_time' => 'datetime:H:i',
        ];
    }

    /**
     * Get the office this work schedule belongs to.
     */
    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }
}
