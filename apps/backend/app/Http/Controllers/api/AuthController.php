<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class AuthController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->authService->register($request->validated());
            return $this->success(
                ['user' => $user],
                'Registration successful. Please check your email.',
                201
            );
        } catch (Exception $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data = $this->authService->login($request->validated());
            return $this->success($data, 'Login successful.');
        } catch (Exception $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 401);
        }
    }

    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        try {
            $this->authService->verifyEmail($token);
            return view('auth.verify-success');
        } catch (Exception $e) {
            return view('auth.verify-error', ['message' => $e->getMessage()]);
        }
    }

    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            $this->authService->resendVerification($request->email);
            return $this->success(null, 'Verification email resent.');
        } catch (Exception $e) {
            return $this->error($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function logout()
    {
        $this->authService->logout();

        return $this->success(null, 'Logout successful.');
    }

    public function me()
    {
        return $this->success(auth('api')->user(), 'User information retrieved successfully.');
    }

    public function redirectToGoogle()
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');
            return $driver->stateless()
                        ->with(['prompt' => 'select_account'])
                        ->redirect();
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function handleGoogleCallback(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Google Callback Hit', $request->all());
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');

            if (config('app.env') === 'local') {
                $driver->setHttpClient(new \GuzzleHttp\Client(['verify' => false]));
            }

            $googleUser = $driver->stateless()->user();
            
            \Illuminate\Support\Facades\Log::info('Google User Obtained', [
                'email' => $googleUser->getEmail(),
                'id' => $googleUser->getId()
            ]);

            $data = $this->authService->handleSocialLogin('google', $googleUser);
            

            $role = $data['user']['role'];
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3002');

            if ($role === 'organizer') {
                $frontendUrl = env('FRONTEND_ORGANIZER_URL', 'http://localhost:3001');
            } else if ($role === 'admin') {
                $frontendUrl = env('FRONTEND_ADMIN_URL', 'http://localhost:3003');
            }

            \Illuminate\Support\Facades\Log::info('Redirecting to frontend', ['url' => $frontendUrl, 'role' => $role]);

            return redirect()->to($frontendUrl . '/auth/callback?token=' . $data['token'] . '&role=' . $role);
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error('LỖI ĐĂNG NHẬP GOOGLE: ' . $e->getMessage());
            
            $fallbackUrl = env('FRONTEND_URL', 'http://localhost:3002');
            return redirect()->to($fallbackUrl . '/login?error=' . urlencode($e->getMessage()));
        }
    }
}
