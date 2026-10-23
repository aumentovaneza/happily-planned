<?php

namespace Database\Seeders;

use App\Models\DrinkPlan;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Shared household login for the couple. Idempotent so re-seeding
        // (e.g. on every container boot) never hits the unique-email constraint.
        User::firstOrCreate(
            ['email' => 'us@happilyplanned.test'],
            [
                'name' => 'Happily Planned',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        // Singleton settings rows.
        Wedding::query()->firstOrCreate([], ['currency' => 'PHP']);
        DrinkPlan::query()->firstOrCreate([]);

        $this->call([
            CategorySeeder::class,
            TaskSeeder::class,
        ]);
    }
}
