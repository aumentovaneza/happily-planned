<?php

namespace Database\Factories;

use App\Models\DrinkPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DrinkPlan>
 */
class DrinkPlanFactory extends Factory
{
    protected $model = DrinkPlan::class;

    public function definition(): array
    {
        return [
            'duration_hours' => 5,
            'event_type' => 'reception',
            'mix' => ['beer' => 40, 'wine' => 30, 'spirits' => 20, 'non_alcoholic' => 10],
            'include_toast' => true,
        ];
    }
}
