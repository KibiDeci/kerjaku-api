<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\LamaranController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::post('/login', [AuthController::class, 'login']);
Route::put('/users/{username}', [UserController::class, 'update']);
Route::get('/lamaran', [LamaranController::class, 'index']);
Route::post('/lamaran', [LamaranController::class, 'store']);
