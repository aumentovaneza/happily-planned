<?php

namespace App\Models;

use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['budget_item_id', 'amount', 'paid_on', 'method', 'note'])]
class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'paid_on' => 'date',
        ];
    }

    /** @return BelongsTo<BudgetItem, $this> */
    public function budgetItem(): BelongsTo
    {
        return $this->belongsTo(BudgetItem::class);
    }
}
