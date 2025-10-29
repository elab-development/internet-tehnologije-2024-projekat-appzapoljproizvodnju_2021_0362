<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlantController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\ActivityController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password',  [AuthController::class, 'resetPassword']);

Route::get('/weather', [WeatherController::class, 'forecast']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    Route::middleware('role:premium,admin')->get('/premium-test', fn() => response()->json(['message' => 'premium or admin ok']));
    Route::middleware('role:admin')->get('/admin-test', fn() => response()->json(['message' => 'admin only ok']));
    
    Route::apiResource('plants', PlantController::class);
    
    Route::get('/activities', [\App\Http\Controllers\ActivityController::class, 'index']);
    Route::post('/activities', [\App\Http\Controllers\ActivityController::class, 'store']);
    Route::get('/activities/{activity}', [\App\Http\Controllers\ActivityController::class, 'show']);
    Route::patch('/activities/{activity}', [\App\Http\Controllers\ActivityController::class, 'update']);
    Route::delete('/activities/{activity}', [\App\Http\Controllers\ActivityController::class, 'destroy']);
    
    Route::get('/comments', [\App\Http\Controllers\CommentController::class, 'index']);
    Route::post('/comments', [\App\Http\Controllers\CommentController::class, 'store']);
    Route::get('/comments/{comment}', [\App\Http\Controllers\CommentController::class, 'show']);
    Route::patch('/comments/{comment}', [\App\Http\Controllers\CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [\App\Http\Controllers\CommentController::class, 'destroy']);
    
});