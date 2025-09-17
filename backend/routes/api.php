<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\WinnerController;
use App\Http\Controllers\Api\BankAccountController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Public routes (for frontend)
Route::prefix('public')->group(function () {
    Route::get('/activities', [ActivityController::class, 'publicIndex']);
    Route::get('/activities/{id}', [ActivityController::class, 'show']);
    Route::get('/bank-accounts', [BankAccountController::class, 'publicIndex']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{numero_pedido}', [OrderController::class, 'show']);
    Route::post('/orders/search', [OrderController::class, 'searchByEmail']);
    Route::get('/winners', [WinnerController::class, 'publicIndex']);
});

// Protected admin routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Activities
    Route::apiResource('activities', ActivityController::class);
    Route::post('activities/{activity}/draw', [ActivityController::class, 'draw']);
    Route::post('activities/{activity}/assign-winner', [ActivityController::class, 'assignWinner']);
    Route::post('activities/{activity}/assign-main-winner', [ActivityController::class, 'assignMainWinner']);
    Route::post('activities/{activity}/mark-as-finished', [ActivityController::class, 'markAsFinished']);
    Route::post('activities/{activity}/execute-raffle', [ActivityController::class, 'executeAutomaticRaffle']);
    Route::get('activities/{activity}/winners-by-number', [ActivityController::class, 'getWinnersByNumber']);
    
    // Orders
    Route::apiResource('orders', OrderController::class)->except(['store']);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    
    // Winners
    Route::apiResource('winners', WinnerController::class);
    Route::post('winners/{winner}/toggle-instagram', [WinnerController::class, 'toggleInstagramAnnouncement']);
    Route::patch('winners/{winner}/announce', [WinnerController::class, 'markAsAnnounced']);
    
    // Bank Accounts
    Route::apiResource('bank-accounts', BankAccountController::class);
    Route::patch('bank-accounts/{bankAccount}/toggle', [BankAccountController::class, 'toggle']);
    
    // Dashboard stats
    Route::get('/stats/dashboard', function () {
        return response()->json([
            'total_activities' => \App\Models\Activity::count(),
            'active_activities' => \App\Models\Activity::where('estado', 'activa')->count(),
            'total_orders' => \App\Models\Order::count(),
            'pending_orders' => \App\Models\Order::where('estado', 'pendiente')->count(),
            'total_revenue' => \App\Models\Order::where('estado', 'pagado')->sum('total_pagado'),
            'total_users' => \App\Models\Order::distinct('email_cliente')->count(),
            'activities_completed_today' => \App\Models\Activity::where('estado', 'finalizada')
                ->whereDate('updated_at', today())->count(),
            'revenue_today' => \App\Models\Order::where('estado', 'pagado')
                ->whereDate('updated_at', today())->sum('total_pagado'),
        ]);
    });
});