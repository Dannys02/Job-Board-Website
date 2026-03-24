<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\SeekerController;
use App\Http\Controllers\AdminController;

// ─── PUBLIC ROUTES ───────────────────────────────────────
// Tidak perlu login untuk akses ini

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Lihat lowongan & kategori bebas diakses siapa saja
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// ─── PROTECTED ROUTES ────────────────────────────────────
// Semua route di bawah wajib login (pakai token Sanctum)

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ─── SEEKER ROUTES ───────────────────────────────────
    Route::middleware('role:seeker')->group(function () {
        Route::post('/jobs/{id}/apply', [SeekerController::class, 'apply']);
        Route::get('/seeker/applications', [SeekerController::class, 'myApplications']);
        Route::get('/seeker/profile', [SeekerController::class, 'profile']);
        Route::put('/seeker/profile', [SeekerController::class, 'updateProfile']);
    });

    // ─── EMPLOYER ROUTES ─────────────────────────────────
    Route::middleware('role:employer')->group(function () {
        Route::get('/employer/jobs', [EmployerController::class, 'index']);
        Route::post('/employer/jobs', [EmployerController::class, 'store']);
        Route::put('/employer/jobs/{id}', [EmployerController::class, 'update']);
        Route::delete('/employer/jobs/{id}', [EmployerController::class, 'destroy']);
        Route::get('/employer/jobs/{id}/applicants', [EmployerController::class, 'applicants']);
        Route::patch('/employer/applications/{id}/status', [EmployerController::class, 'updateStatus']);
    });

    // ─── ADMIN ROUTES ────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'stats']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::patch('/admin/users/{id}/status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/admin/jobs', [AdminController::class, 'jobs']);
        Route::patch('/admin/jobs/{id}/status', [AdminController::class, 'updateJobStatus']);
        Route::delete('/admin/jobs/{id}', [AdminController::class, 'destroyJob']);
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);
    });
});