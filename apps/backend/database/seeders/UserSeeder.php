<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name'                          => 'Super Admin',
                'email'                         => 'hosangg113@gmail.com',
                'password'                      => Hash::make('Admin@123'),
                'role'                          => 'admin',
                'email_verified'                => true,
                'email_verified_at'             => now(),
                'verification_token'            => null,
                'verification_token_expires_at' => null,
                'created_at'                    => now(),
                'updated_at'                    => now(),
            ],
        ]);
    }
}