<?php

namespace Database\Seeders;

use App\Enums\CategoryType;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $budget = [
            'Venue',
            'Catering',
            'Photography & Video',
            'Attire & Beauty',
            'Flowers & Decor',
            'Music & Entertainment',
            'Stationery & Invitations',
            'Cake & Desserts',
            'Transportation',
            'Rings',
            'Officiant / Church',
            'Gifts & Favors',
            'Miscellaneous',
        ];

        $vendor = [
            'Venue',
            'Catering',
            'Photo / Video',
            'Flowers',
            'Music / DJ / Band',
            'Attire',
            'Hair & Makeup',
            'Cake',
            'Transport',
            'Officiant',
            'Coordinator',
        ];

        foreach ($budget as $i => $name) {
            Category::firstOrCreate(
                ['name' => $name, 'type' => CategoryType::Budget],
                ['sort_order' => $i],
            );
        }

        foreach ($vendor as $i => $name) {
            Category::firstOrCreate(
                ['name' => $name, 'type' => CategoryType::Vendor],
                ['sort_order' => $i],
            );
        }
    }
}
