<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\admin\CategoryController;
use App\Http\Controllers\api\organizer\EventController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

    // Protected Auth Routes
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Admin Routes
Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    // Category Management
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        
        // Extended Category Routes
        Route::post('/{id}/restore', [CategoryController::class, 'restore']);
        Route::patch('/{id}/deactivate', [CategoryController::class, 'deactivate']);
        Route::patch('/{id}/activate', [CategoryController::class, 'activate']);
    });
});

// Organizer Routes
Route::middleware(['auth:api', 'role:organizer'])->prefix('organizer')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
});
