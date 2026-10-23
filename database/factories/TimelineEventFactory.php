<?php

namespace Database\Factories;

use App\Models\TimelineEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TimelineEvent>
 */
class TimelineEventFactory extends Factory
{
    protected $model = TimelineEvent::class;

    public function definition(): array
    {
        return [
            'start_time' => fake()->time('H:i'),
            'title' => fake()->sentence(2),
        ];
    }
}
