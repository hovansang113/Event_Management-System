<?php
namespace App\Http\Controllers;
use App\Traits\ApiResponse;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    use ApiResponse;
    # REQ_01: User Registration
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $token = hash('sha256', $data['email'] . now()->timestamp);

        $user = User::create([
            'name'  => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'verification_token' => $token,
            'verification_token_expires_at' => now()->addHours(24)
        ]);

        // gửi mail (bật lại khi cần)
        // Mail::to($user->email)->send(new VerificationMail($user, $token));

        return $this->success(
            ['user' => $user],
            'Đăng ký thành công. Vui lòng kiểm tra email.',
            201
        );
    }
}