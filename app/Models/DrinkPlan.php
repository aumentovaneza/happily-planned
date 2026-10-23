<?php

namespace App\Models;

use Database\Factories\DrinkPlanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Singleton configuration for the drinks calculator.
 */
#[Fillable([
    'guest_count',
    'duration_hours',
    'event_type',
    'mix',
    'include_toast',
    'notes',
    'ai_tip',
    'ai_tip_generated_at',
])]
class DrinkPlan extends Model
{
    /** @use HasFactory<DrinkPlanFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'guest_count' => 'integer',
            'duration_hours' => 'integer',
            'mix' => 'array',
            'include_toast' => 'boolean',
            'ai_tip_generated_at' => 'datetime',
        ];
    }

    /**
     * Fetch (or lazily create) the single drink plan row.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
