<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Service\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
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
}
