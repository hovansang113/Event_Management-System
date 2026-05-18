<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name'  => 'Super Admin',
                'email' => 'hosangg113@gmail.com',
                'role'  => 'admin',
            ],
            [
                'name'  => 'Organizer Demo',
                'email' => 'organizer@example.com',
                'role'  => 'organizer',
            ],
            [
                'name'  => 'Attendee Demo',
                'email' => 'attendee@example.com',
                'role'  => 'attendee',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name'                          => $user['name'],
                    'password'                      => Hash::make('Admin@123'),
                    'role'                          => $user['role'],
                    'email_verified'                => true,
                    'email_verified_at'             => now(),
                    'verification_token'            => null,
                    'verification_token_expires_at' => null,
                ]
            );
        }
    }
}
