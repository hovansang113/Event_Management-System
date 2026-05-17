<?php

namespace App\Service;

use App\Mail\VerificationMail;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
        $token = hash('sha256', $data['email'] . now()->timestamp);

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
            throw new Exception('Thông tin đăng nhập không chính xác.', 401);
        }

        if (isset($credentials['role']) && $user->role !== $credentials['role']) {
            throw new Exception('Bạn không có quyền truy cập vào hệ thống này.', 403);
        }

        if (!$user->email_verified) {
            throw new Exception('Vui lòng xác minh email trước khi đăng nhập.', 403);
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
            throw new Exception('Link xác minh không hợp lệ hoặc đã được sử dụng.');
        }

        if (now()->gt($user->verification_token_expires_at)) {
            throw new Exception('Link đã hết hạn. Vui lòng yêu cầu gửi lại.');
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
            throw new Exception('Email không tồn tại hoặc đã được xác minh.', 404);
        }

        $token = hash('sha256', $user->email . now()->timestamp);
        
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
            // Token đã hết hạn hoặc không hợp lệ, không cần xử lý thêm
        }
    }
}
