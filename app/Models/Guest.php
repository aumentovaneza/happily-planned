<?php

namespace App\Models;

use App\Enums\GuestSide;
use App\Enums\RsvpStatus;
use Database\Factories\GuestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'table_id',
    'name',
    'side',
    'group',
    'phone',
    'email',
    'invited',
    'rsvp_status',
    'plus_one',
    'plus_one_name',
    'seat_note',
    'notes',
])]
class Guest extends Model
{
    /** @use HasFactory<GuestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'side' => GuestSide::class,
            'rsvp_status' => RsvpStatus::class,
            'invited' => 'boolean',
            'plus_one' => 'boolean',
        ];
    }

    /** @return BelongsTo<Table, $this> */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    /**
     * Seats this guest occupies (self + plus-one).
     */
    public function headcount(): int
    {
        return 1 + ($this->plus_one ? 1 : 0);
    }

    /**
     * Total attending headcount across all confirmed guests (incl. plus-ones).
     */
    public static function confirmedHeadcount(): int
    {
        return static::query()
            ->where('rsvp_status', RsvpStatus::Confirmed)
            ->get()
            ->sum(fn (self $guest) => $guest->headcount());
    }
}
