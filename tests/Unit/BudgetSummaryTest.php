<?php

namespace Tests\Unit;

use App\Models\BudgetItem;
use App\Models\Payment;
use App\Support\BudgetSummary;
use Illuminate\Support\Collection;
use Tests\TestCase;

class BudgetSummaryTest extends TestCase
{
    private function item(int $estimated, ?int $actual, string $status, array $payments = []): BudgetItem
    {
        $item = new BudgetItem([
            'estimated_amount' => $estimated,
            'actual_amount' => $actual,
            'status' => $status,
        ]);

        $item->setRelation(
            'payments',
            new Collection(array_map(fn (int $a) => new Payment(['amount' => $a]), $payments)),
        );

        return $item;
    }

    public function test_it_separates_committed_from_considering_and_projects_totals(): void
    {
        $items = new Collection([
            // Committed: planned 1000, actual 1200, paid 500.
            $this->item(1000_00, 1200_00, 'committed', [500_00]),
            // Committed with no actual yet: uses estimate 2000, paid 0.
            $this->item(2000_00, null, 'committed'),
            // Considering: 800, excluded from running totals.
            $this->item(800_00, null, 'considering'),
        ]);

        $summary = BudgetSummary::for($items, 5000_00);

        $this->assertSame(3000_00, $summary['plannedTotal']);   // 1000 + 2000
        $this->assertSame(3200_00, $summary['actualTotal']);    // 1200 + 2000
        $this->assertSame(500_00, $summary['paidTotal']);
        $this->assertSame(2700_00, $summary['remainingTotal']); // 3200 - 500
        $this->assertSame(800_00, $summary['consideringTotal']);
        $this->assertSame(4000_00, $summary['projectedTotal']); // 3200 + 800
        $this->assertSame(1800_00, $summary['variance']);       // 5000 - 3200
        $this->assertSame(1000_00, $summary['projectedVariance']); // 5000 - 4000
    }

    public function test_variance_is_null_without_a_ceiling(): void
    {
        $summary = BudgetSummary::for(new Collection([
            $this->item(1000_00, null, 'committed'),
        ]), null);

        $this->assertNull($summary['variance']);
        $this->assertNull($summary['projectedVariance']);
    }
}
