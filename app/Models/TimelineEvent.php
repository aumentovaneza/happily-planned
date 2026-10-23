<?php

namespace App\Models;

use Database\Factories\TimelineEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['vendor_id', 'start_time', 'title', 'location', 'responsible', 'notes', 'sort_order'])]
class TimelineEvent extends Model
{
    /** @use HasFactory<TimelineEventFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:H:i',
        ];
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }
}
