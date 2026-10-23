<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // A sensible default wedding checklist grouped by timeframe.
        $checklist = [
            '12+ months out' => [
                'Set your overall budget',
                'Draft the guest list',
                'Choose and book your venue',
                'Decide on a wedding date',
                'Start a Pinterest / inspiration board',
            ],
            '9 months out' => [
                'Book photographer & videographer',
                'Book caterer',
                'Book officiant / church',
                'Shop for wedding attire',
                'Send save-the-dates',
            ],
            '6 months out' => [
                'Book florist & decor',
                'Book music / DJ / band',
                'Order the cake',
                'Arrange transportation',
                'Plan the honeymoon',
            ],
            '3 months out' => [
                'Finalize the menu & tasting',
                'Order invitations (Canva)',
                'Buy wedding rings',
                'Schedule hair & makeup trial',
                'Plan the day-of timeline',
            ],
            '1 month out' => [
                'Send invitations',
                'Finalize seating chart',
                'Confirm all vendors',
                'Final dress / suit fitting',
                'Apply for marriage license',
            ],
            'Week of' => [
                'Confirm final headcount with caterer',
                'Pack for the honeymoon',
                'Prepare vendor payments & tips',
                'Rehearsal & rehearsal dinner',
            ],
            'Day of' => [
                'Hair & makeup',
                'Exchange gifts with partner',
                'Get married!',
            ],
        ];

        $sort = 0;

        foreach ($checklist as $category => $tasks) {
            foreach ($tasks as $title) {
                Task::firstOrCreate(
                    ['title' => $title, 'category' => $category],
                    ['sort_order' => $sort++],
                );
            }
        }
    }
}
