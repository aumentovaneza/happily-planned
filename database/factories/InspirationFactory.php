<?php

namespace Database\Factories;

use App\Models\Inspiration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inspiration>
 */
class InspirationFactory extends Factory
{
    protected $model = Inspiration::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'url' => fake()->url(),
            'category' => 'Flowers',
        ];
    }
}
