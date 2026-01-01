<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $filter = $request->query('filter', 'daily');
        $storeId = $request->query('store_id', 'all');
        $user = $request->user();

        // Get all tenant IDs owned by this user
        $ownedTenantIds = \App\Models\Tenant::where('user_id', $user->id)->pluck('id')->toArray();

        // Start query bypassing the default tenant scope because we might want ALL stores
        $query = Transaction::withoutGlobalScope('tenant')
            ->whereIn('tenant_id', $ownedTenantIds)
            ->where('payment_status', 'success');

        if ($storeId !== 'all' && in_array($storeId, $ownedTenantIds)) {
            $query->where('tenant_id', $storeId);
        }
        $format = '';

        switch ($filter) {
            case 'daily':
                $query->whereDate('created_at', Carbon::today());
                $format = 'Y-m-d H:i';
                break;
            case 'weekly':
                $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                $format = 'Y-m-d';
                break;
            case 'monthly':
                $query->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year);
                $format = 'Y-m-d';
                break;
            case 'yearly':
                $query->whereYear('created_at', Carbon::now()->year);
                $format = 'Y-m';
                break;
            case 'all':
                // No filter needed, show everything
                $format = 'Y-m-d';
                break;
            case 'custom':
                $request->validate([
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                ]);
                $start = Carbon::parse($request->input('start_date'))->startOfDay();
                $end = Carbon::parse($request->input('end_date'))->endOfDay();
                $query->whereBetween('created_at', [$start, $end]);
                $format = 'Y-m-d';
                break;
        }

        // Calculate aggregations BEFORE pagination
        // We clone the query so the aggregations apply to the FULL filtered dataset
        $summaryQuery = $query->clone();
        $totalRevenue = $summaryQuery->sum('total_amount');
        $totalTransactions = $summaryQuery->count();
        $soldItems = $summaryQuery->with('items')->get()->flatMap->items->sum('quantity');

        // Now paginate the actual data list
        $transactions = $query->with(['items.product', 'tenant', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(50); // Pagination limit 50

        return response()->json([
            'filter' => $filter,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_transactions' => $totalTransactions,
                'items_sold' => $soldItems
            ],
            'data' => $transactions
        ]);
    }

    public function stock(Request $request)
    {
        $filter = $request->query('filter', 'current');

        if ($filter === 'history') {
            // Placeholder for inventory logs if implemented
            return response()->json(['message' => 'Stock history not fully implemented yet']);
        }

        $products = Product::select('id', 'name', 'stock', 'price', 'category_id', 'is_active')
            ->orderBy('stock', 'asc') // Low stock first
            ->get();

        $totalValue = $products->sum(function ($product) {
            return $product->price * $product->stock;
        });

        return response()->json([
            'summary' => [
                'total_products' => $products->count(),
                'total_stock_value' => $totalValue,
                'low_stock_count' => $products->where('stock', '<', 10)->count()
            ],
            'data' => $products
        ]);
    }
}
