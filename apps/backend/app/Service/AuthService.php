<?php

namespace App\Service;

use App\Mail\VerificationMail;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Exception;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        $token = Str::random(64);

        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $user;
    }

    public function login(array $credentials)
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw new Exception('Incorrect login credentials.', 401);
        }

        if (isset($credentials['role']) && $user->role !== $credentials['role']) {
            throw new Exception('You do not have permission to access this system.', 403);
        }

        if (!$user->email_verified) {
            throw new Exception('Please verify your email before logging in.', 403);
        }

        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
        ];
    }

    public function verifyEmail(string $token)
    {
        $user = $this->userRepository->findByVerificationToken($token);

        if (!$user) {
            throw new Exception('Invalid or already used verification link.');
        }

        if (now()->gt($user->verification_token_expires_at)) {
            throw new Exception('Link has expired. Please request a new one.');
        }

        return $this->userRepository->update($user, [
            'email_verified' => true,
            'email_verified_at' => now(),
            'verification_token' => null,
            'verification_token_expires_at' => null,
        ]);
    }

    public function resendVerification(string $email)
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || $user->email_verified) {
            throw new Exception('Email does not exist or is already verified.', 404);
        }

        $token = Str::random(64);
        
        $this->userRepository->update($user, [
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return true;
    }

    public function logout()
    {
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Exception $e) {
            // Token expired or invalid, no further action needed
        }
    }
}
