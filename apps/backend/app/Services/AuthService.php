<?php

namespace App\Services;

use App\Mail\VerificationMail;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Exception;

class AuthService
{
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): User
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

    public function login(array $credentials): array
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

    public function verifyEmail(string $token): bool
    {
        $user = $this->userRepository->findByVerificationToken($token);

        if (!$user) {
            throw new Exception('Invalid or already used verification link.');
        }

        if (now()->gt($user->verification_token_expires_at)) {
            throw new Exception('Link has expired. Please request a new one.');
        }

        return $this->userRepository->update($user->id, [
            'email_verified' => true,
            'email_verified_at' => now(),
            'verification_token' => null,
            'verification_token_expires_at' => null,
        ]);
    }

    public function resendVerification(string $email): bool
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || $user->email_verified) {
            throw new Exception('Email does not exist or is already verified.', 404);
        }

        $token = Str::random(64);
        
        $this->userRepository->update($user->id, [
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return true;
    }

    public function logout(): void
    {
        try {
            $token = JWTAuth::getToken();
            if ($token) {
                JWTAuth::invalidate($token);
            }
        } catch (\Exception $e) {
            // Token expired or invalid
        }
    }

    public function handleSocialLogin(string $provider, $socialUser): array
    {
        $email = $socialUser->getEmail();
        $googleId = $socialUser->getId();

        $user = $this->userRepository->findByEmail($email);

        if (!$user) {
            $user = $this->userRepository->create([
                'name' => $socialUser->getName() ?? 'User',
                'email' => $email,
                'password' => Hash::make(Str::random(32)),
                'role' => 'attendee',
                'email_verified' => true,
                'email_verified_at' => now(),
                'google_id' => $googleId,
            ]);
        } else {
            $this->userRepository->update($user->id, [
                'google_id' => $googleId,
                'email_verified' => true,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        $token = JWTAuth::fromUser($user);

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
