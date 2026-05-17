<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function create(array $data)
    {
        return User::create($data);
    }
    
    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }

    public function findByVerificationToken(string $token)
    {
        return User::where('verification_token', $token)
            ->where('email_verified', false)
            ->first();
    }

    public function update(User $user, array $data)
    {
        $user->update($data);
        return $user;
    }
}
