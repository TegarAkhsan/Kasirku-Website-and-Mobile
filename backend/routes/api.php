<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StoreUserController;
use App\Http\Controllers\OwnerTenantController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']); // For tenant registration

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Public Config (Authenticated)
    Route::get('/config', function () {
        return response()->json([
            'midtrans_client_key' => config('services.midtrans.client_key')
        ]);
    });

    // Super Admin Routes
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::get('stats', [AdminController::class, 'stats']);
        Route::get('tenants', [AdminController::class, 'tenants']);
        Route::apiResource('tenants', TenantController::class);
        // Add module management here
    });

    // Tenant Scoped Routes (Owner/Cashier)
    Route::middleware(['tenant'])->group(function () {

        // Owner Routes
        Route::prefix('owner')->middleware(['role:owner'])->group(function () {
            Route::apiResource('products', ProductController::class);
            Route::apiResource('categories', CategoryController::class);
            Route::apiResource('users', StoreUserController::class); // Manage Cashiers

            // Multi-Store Management
            Route::get('stores', [OwnerTenantController::class, 'index']);
            Route::post('stores', [OwnerTenantController::class, 'store']);
            Route::put('stores/{id}', [OwnerTenantController::class, 'update']);
            Route::delete('stores/{id}', [OwnerTenantController::class, 'destroy']);
            Route::post('stores/{id}/switch', [OwnerTenantController::class, 'switch']);
            Route::get('stores/{id}/stats', [OwnerTenantController::class, 'stats']);

            Route::get('dashboard', [DashboardController::class, 'ownerDashboard']);
            Route::get('reports/sales', [ReportController::class, 'sales']);
            Route::get('reports/stock', [ReportController::class, 'stock']);
            // Add user management (cashiers) here
        });

        // Cashier Routes (POS)
        Route::prefix('pos')->group(function () {
            Route::get('products', [ProductController::class, 'index']); // Cashier needs to see products
            Route::post('transactions', [TransactionController::class, 'store']);
            Route::get('transactions', [TransactionController::class, 'index']); // This handles history
            Route::get('transactions/{id}', [TransactionController::class, 'show']);
            Route::post('transactions/{id}/mock-pay', [TransactionController::class, 'mockPay']); // Mock Payment

            // Shift Management
            Route::get('shift/current', [App\Http\Controllers\ShiftController::class, 'current']);
            Route::post('shift/start', [App\Http\Controllers\ShiftController::class, 'start']);
            Route::post('shift/close', [App\Http\Controllers\ShiftController::class, 'close']);

            // Receipt Settings (Accessible by POS to read)
            Route::get('settings/receipt', [App\Http\Controllers\ReceiptSettingController::class, 'show']);
        });

        Route::post('settings/receipt', [App\Http\Controllers\ReceiptSettingController::class, 'update']); // Owner updates

    });
});

// Webhooks (Public)
Route::post('/webhooks/xendit', [App\Http\Controllers\WebhookController::class, 'handleXendit'])->name('api.webhooks.xendit');
