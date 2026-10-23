<?php

namespace Database\Factories;

use App\Models\BudgetItem;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'budget_item_id' => BudgetItem::factory(),
            'amount' => fake()->numberBetween(10000, 1000000),
            'paid_on' => fake()->date(),
            'method' => 'GCash',
        ];
    }
}
