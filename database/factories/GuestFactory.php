<?php

namespace Database\Factories;

use App\Enums\GuestSide;
use App\Enums\RsvpStatus;
use App\Models\Guest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Guest>
 */
class GuestFactory extends Factory
{
    protected $model = Guest::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'side' => GuestSide::Other,
            'invited' => true,
            'rsvp_status' => RsvpStatus::Pending,
            'plus_one' => false,
        ];
    }

    public function confirmed(): static
    {
        return $this->state(['rsvp_status' => RsvpStatus::Confirmed]);
    }
}
