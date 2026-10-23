<?php

namespace App\Models;

use App\Enums\BudgetItemStatus;
use Database\Factories\BudgetItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'category_id',
    'vendor_id',
    'title',
    'estimated_amount',
    'actual_amount',
    'status',
    'due_date',
    'notes',
    'sort_order',
])]
class BudgetItem extends Model
{
    /** @use HasFactory<BudgetItemFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'estimated_amount' => 'integer',
            'actual_amount' => 'integer',
            'status' => BudgetItemStatus::class,
            'due_date' => 'date',
        ];
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return BelongsTo<Vendor, $this> */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Total paid so far (centavos), from recorded payments.
     */
    public function paidAmount(): int
    {
        return (int) $this->payments->sum('amount');
    }
}
