<?php

namespace App\Models;

use Database\Factories\WeddingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Singleton settings record for the one household using this tool.
 */
#[Fillable([
    'partner_one_name',
    'partner_two_name',
    'wedding_date',
    'budget_ceiling',
    'currency',
    'advisor_summary',
    'advisor_generated_at',
])]
class Wedding extends Model
{
    /** @use HasFactory<WeddingFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'wedding_date' => 'date',
            'budget_ceiling' => 'integer',
            'advisor_generated_at' => 'datetime',
        ];
    }

    /**
     * Fetch (or lazily create) the single wedding settings row.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
