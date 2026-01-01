<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function ownerDashboard(Request $request)
    {
        // Tenant scope is applied automatically to models via HasTenant trait

        $today = now()->format('Y-m-d');

        $totalSalesToday = Transaction::whereDate('created_at', $today)->sum('total_amount');
        $totalTransactionsToday = Transaction::whereDate('created_at', $today)->count();

        $lowStockProducts = Product::where('stock', '<', 5)->take(5)->get();

        $recentTransactions = Transaction::with('items')->latest()->take(5)->get();

        return response()->json([
            'stats' => [
                'sales_today' => $totalSalesToday,
                'transactions_today' => $totalTransactionsToday,
                'total_stores' => \App\Models\Tenant::where('user_id', $request->user()->id)->count()
            ],
            'low_stock' => $lowStockProducts,
            'recent_transactions' => $recentTransactions
        ]);
    }
}
