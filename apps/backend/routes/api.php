<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
// routes/api.php
Route::prefix('auth')->group(function () {
    // Public
    Route::post('/register', [AuthController::class, 'register']);        // REQ_01
    Route::post('/login', [AuthController::class, 'login']);              // REQ_02
    Route::get('/verify-email', [AuthController::class, 'verifyEmail']); // REQ_03
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']); // REQ_03

    // Protected
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);        // REQ_04
        Route::get('/me', [AuthController::class, 'me']);
    });
});