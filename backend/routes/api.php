<?php

use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
Route::post('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');
Route::get('/user', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'user'])
    ->middleware('auth:sanctum');

Route::get('/auth/google', [\App\Http\Controllers\Auth\GoogleController::class, 'redirect'])
    ->name('google.login');
Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\GoogleController::class, 'callback'])
    ->name('google.callback');

Route::prefix('categories')->group(function () {
    Route::get('/', [\App\Http\Controllers\CategoryController::class, 'index']);
    Route::get('/{slug}', [\App\Http\Controllers\CategoryController::class, 'show']);
});

Route::prefix('books')->group(function () {
    Route::get('/', [\App\Http\Controllers\BookController::class, 'index']);
    Route::get('/featured', [\App\Http\Controllers\BookController::class, 'featured']);
    Route::get('/{slug}', [\App\Http\Controllers\BookController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);

        Route::apiResource('books', \App\Http\Controllers\Admin\BookController::class);
        Route::apiResource('categories', \App\Http\Controllers\Admin\CategoryController::class);
    });