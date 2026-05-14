<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('category')->insert([
            [
                'name'        => 'Âm nhạc',
                'description' => 'Các sự kiện âm nhạc, concert, live show',
                'icon'        => 'music',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Thể thao',
                'description' => 'Các sự kiện thể thao, giải đấu',
                'icon'        => 'sports',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Công nghệ',
                'description' => 'Hội thảo, workshop về công nghệ',
                'icon'        => 'technology',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Ẩm thực',
                'description' => 'Lễ hội ẩm thực, food festival',
                'icon'        => 'food',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Giáo dục',
                'description' => 'Hội thảo, khóa học, seminar',
                'icon'        => 'education',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Nghệ thuật',
                'description' => 'Triển lãm, biểu diễn nghệ thuật',
                'icon'        => 'art',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Du lịch',
                'description' => 'Các tour du lịch, khám phá',
                'icon'        => 'travel',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'name'        => 'Sức khỏe',
                'description' => 'Hội thảo sức khỏe, yoga, thiền',
                'icon'        => 'health',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}