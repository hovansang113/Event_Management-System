<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Music',
                'description' => 'Exciting music events, concerts, and live shows.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/3844/3844724.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Sports',
                'description' => 'Football tournaments, tennis matches, marathons, and physical activities.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/857/857418.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Technology',
                'description' => 'Tech conferences, product launches, and programming workshops.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/4257/4257487.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Food & Drink',
                'description' => 'Explore culinary culture, cooking classes, and food festivals.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/706/706164.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Education',
                'description' => 'Short-term training courses, seminars, and career orientation.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/2997/2997314.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Arts',
                'description' => 'Art exhibitions, theatrical plays, and cultural performances.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/1033/1033921.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Travel',
                'description' => 'Nature exploration tours, trekking, and cultural exchanges.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Health',
                'description' => 'Yoga events, meditation sessions, and proactive healthcare.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
                'is_active'   => true,
            ],
            [
                'name'        => 'Business',
                'description' => 'Entrepreneur conferences, investment networking, and startups.',
                'icon'        => 'https://cdn-icons-png.flaticon.com/512/2652/2652234.png',
                'is_active'   => false,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                [
                    'slug'        => Str::slug($category['name']),
                    'description' => $category['description'],
                    'icon'        => $category['icon'],
                    'is_active'   => $category['is_active'],
                ]
            );
        }
    }
}
