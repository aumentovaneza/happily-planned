<?php

namespace Database\Factories;

use App\Enums\BudgetItemStatus;
use App\Models\BudgetItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BudgetItem>
 */
class BudgetItemFactory extends Factory
{
    protected $model = BudgetItem::class;

    public function definition(): array
    {
        return [
            'title' => fake()->words(2, true),
            'estimated_amount' => fake()->numberBetween(100000, 10000000),
            'actual_amount' => null,
            'status' => BudgetItemStatus::Committed,
        ];
    }

    public function considering(): static
    {
        return $this->state(['status' => BudgetItemStatus::Considering]);
    }
}
