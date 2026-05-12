<?php
namespace App\Http\Controllers;
use App\Traits\ApiResponse;

use App\Models\User;
use Illuminate\Http\Request;                 // ← thêm dòng này
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationMail;

class AuthController extends Controller
{
    use ApiResponse;

    # REQ_01: User Registration
    public function register(RegisterRequest $request)
    {
        $data  = $request->validated();
        $token = hash('sha256', $data['email'] . now()->timestamp);

        $user = User::create([
            'name'                          => $data['name'],
            'email'                         => $data['email'],
            'password'                      => Hash::make($data['password']),
            'role'                          => $data['role'],
            'verification_token'            => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $this->success(
            ['user' => $user],
            'Đăng ký thành công. Vui lòng kiểm tra email.',
            201
        );
    }

    # REQ_02: Verify Email
    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        $user = User::where('verification_token', $token)
                    ->where('email_verified', false)
                    ->first();

        // Token không tồn tại hoặc đã dùng
        if (!$user) {
            return view('auth.verify-error', ['message' => 'Link xác minh không hợp lệ hoặc đã được sử dụng.']);
        }

        // Token hết hạn
        if (now()->gt($user->verification_token_expires_at)) {
            return view('auth.verify-error', ['message' => 'Link đã hết hạn. Vui lòng yêu cầu gửi lại.']);
        }

        $user->update([
            'email_verified'                => true,
            'email_verified_at'             => now(),
            'verification_token'            => null,
            'verification_token_expires_at' => null,
        ]);

        return view('auth.verify-success');
    }

    # REQ_03: Resend Verification Email
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
            'verification_token'            => $token,
            'verification_token_expires_at' => now()->addHours(24),
        ]);

        Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $this->success(null, 'Đã gửi lại email xác minh.');
    }
}