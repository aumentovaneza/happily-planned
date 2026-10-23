<?php

namespace App\Models;

use App\Enums\TableShape;
use Database\Factories\TableFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A seating table that guests are assigned to.
 */
#[Fillable(['name', 'capacity', 'shape', 'sort_order', 'notes'])]
class Table extends Model
{
    /** @use HasFactory<TableFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'shape' => TableShape::class,
        ];
    }

    /** @return HasMany<Guest, $this> */
    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }
}
