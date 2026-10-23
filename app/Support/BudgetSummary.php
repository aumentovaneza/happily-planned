<?php

namespace App\Support;

use App\Enums\BudgetItemStatus;
use App\Models\BudgetItem;
use Illuminate\Support\Collection;

/**
 * Single source of truth for budget totals, reused by the dashboard and the
 * budget page. All amounts are integer centavos.
 *
 * Conventions:
 *  - "effective cost" of an item = actual_amount when set, otherwise estimated_amount.
 *  - Committed items count toward the running total; "considering" items are the
 *    what-if sandbox and only affect the projected total.
 */
class BudgetSummary
{
    /**
     * @param  Collection<int, BudgetItem>  $items  with `payments` eager-loaded
     * @return array<string, mixed>
     */
    public static function for(Collection $items, ?int $ceiling): array
    {
        $committed = $items->filter(fn (BudgetItem $i) => $i->status === BudgetItemStatus::Committed);
        $considering = $items->filter(fn (BudgetItem $i) => $i->status === BudgetItemStatus::Considering);

        $effective = fn (BudgetItem $i): int => $i->actual_amount ?? $i->estimated_amount;

        $plannedTotal = (int) $committed->sum('estimated_amount');
        $actualTotal = (int) $committed->sum($effective);
        $paidTotal = (int) $committed->sum(fn (BudgetItem $i) => $i->payments->sum('amount'));
        $remainingTotal = $actualTotal - $paidTotal;
        $consideringTotal = (int) $considering->sum($effective);
        $projectedTotal = $actualTotal + $consideringTotal;

        return [
            'ceiling' => $ceiling,
            'plannedTotal' => $plannedTotal,
            'actualTotal' => $actualTotal,
            'paidTotal' => $paidTotal,
            'remainingTotal' => $remainingTotal,
            'consideringTotal' => $consideringTotal,
            'projectedTotal' => $projectedTotal,
            'variance' => $ceiling !== null ? $ceiling - $actualTotal : null,
            'projectedVariance' => $ceiling !== null ? $ceiling - $projectedTotal : null,
            'committedCount' => $committed->count(),
            'consideringCount' => $considering->count(),
            'byCategory' => self::byCategory($items, $effective),
        ];
    }

    /**
     * Per-category subtotals keyed by category id ("none" for uncategorized).
     *
     * @param  Collection<int, BudgetItem>  $items
     * @param  callable(BudgetItem): int  $effective
     * @return array<string, array<string, int>>
     */
    protected static function byCategory(Collection $items, callable $effective): array
    {
        return $items
            ->groupBy(fn (BudgetItem $i) => $i->category_id ?? 'none')
            ->map(function (Collection $group) use ($effective): array {
                $committed = $group->filter(fn (BudgetItem $i) => $i->status === BudgetItemStatus::Committed);

                return [
                    'planned' => (int) $committed->sum('estimated_amount'),
                    'actual' => (int) $committed->sum($effective),
                    'paid' => (int) $committed->sum(fn (BudgetItem $i) => $i->payments->sum('amount')),
                    'considering' => (int) $group
                        ->filter(fn (BudgetItem $i) => $i->status === BudgetItemStatus::Considering)
                        ->sum($effective),
                ];
            })
            ->toArray();
    }
}
