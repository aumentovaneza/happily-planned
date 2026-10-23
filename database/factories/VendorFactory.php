<?php

namespace Database\Factories;

use App\Enums\VendorStatus;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Vendor>
 */
class VendorFactory extends Factory
{
    protected $model = Vendor::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'status' => VendorStatus::Considering,
            'quoted_price' => fake()->numberBetween(10000, 50000000),
            'rating' => fake()->numberBetween(1, 5),
        ];
    }
}
