<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\VerificationMail;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $token = hash('sha256', $data['email'] . now()->timestamp);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $this->success(
            ['user' => $user],
            'Đăng ký thành công. Vui lòng kiểm tra email.',
            201
        );
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $this->error('Thông tin đăng nhập không chính xác.', 401);
        }

        if (isset($credentials['role']) && $user->role !== $credentials['role']) {
            return $this->error('Bạn không có quyền truy cập vào hệ thống này.', 403);
        }

        if (!$user->email_verified) {
            return $this->error('Vui lòng xác minh email trước khi đăng nhập.', 403);
        }

        $token = JWTAuth::fromUser($user);

        return $this->success(
            [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                ],
            ],
            'Đăng nhập thành công.'
        );
    }

    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        $user = User::where('verification_token', $token)
            ->where('email_verified', false)
            ->first();

        if (!$user) {
            return view('auth.verify-error', ['message' => 'Link xác minh không hợp lệ hoặc đã được sử dụng.']);
        }

        if (now()->gt($user->verification_token_expires_at)) {
            return view('auth.verify-error', ['message' => 'Link đã hết hạn. Vui lòng yêu cầu gửi lại.']);
        }

        $user->update([
            'email_verified' => true,
            'email_verified_at' => now(),
            'verification_token' => null,
            'verification_token_expires_at' => null,
        ]);

        return view('auth.verify-success');
    }

    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)
            ->where('email_verified', false)
            ->first();

        if (!$user) {
            return $this->error('Email không tồn tại hoặc đã được xác minh.', 404);
        }

        $token = hash('sha256', $user->email . now()->timestamp);
        $user->update([
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $this->success(null, 'Đã gửi lại email xác minh.');
    }

    public function logout()
    {
        auth('api')->check();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công',
        ]);
    }

    public function me()
    {
        return $this->success(auth('api')->user(), 'Lấy thông tin người dùng thành công.');
    }
}