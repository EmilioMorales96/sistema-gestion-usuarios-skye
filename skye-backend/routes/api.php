<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes para CatWare Systems
|--------------------------------------------------------------------------
*/

// Rutas públicas (sin autenticación)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Rutas protegidas (con autenticación Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // User routes
    Route::get('/users', [UserController::class, 'index']);
    
    // Ruta original (información del usuario actual)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
