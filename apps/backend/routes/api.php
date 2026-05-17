<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\admin\CategoryController;
use App\Http\Controllers\api\organizer\EventController;
use Illuminate\Support\Facades\Route;

// url: http://localhost:8000/api/auth/register

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

    // Protected auth
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});


Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

Route::middleware(['auth:api', 'role:organizer'])->prefix('organizer')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
});

