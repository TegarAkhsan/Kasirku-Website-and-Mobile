<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OwnerTenantController extends Controller
{
    public function index(Request $request)
    {
        return Tenant::where('user_id', $request->user()->id)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $tenant = Tenant::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'active'
        ]);

        return response()->json($tenant, 201);
    }

    public function update(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $tenant->update($validated);

        return response()->json($tenant);
    }

    public function destroy(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);

        // Prevent deleting the last tenant or current tenant if strictly enforcing
        // For now allow deletion but user context might break if they don't switch
        $tenant->delete();

        return response()->noContent();
    }

    public function switch(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);

        $request->user()->update(['tenant_id' => $tenant->id]);

        return response()->json(['message' => 'Switched to ' . $tenant->name, 'user' => $request->user()]);
    }

    public function stats(Request $request, $id)
    {
        $tenant = Tenant::where('user_id', $request->user()->id)->findOrFail($id);

        $revenue = Transaction::where('tenant_id', $tenant->id)
            ->where('payment_status', 'success')
            ->sum('total_amount');

        $transactions_count = Transaction::where('tenant_id', $tenant->id)->count();

        // Monthly revenue for graph (last 6 months)
        $monthlyRevenue = Transaction::where('tenant_id', $tenant->id)
            ->where('payment_status', 'success')
            ->select(
                DB::raw('sum(total_amount) as revenue'),
                DB::raw("DATE_FORMAT(created_at,'%Y-%m') as month")
            )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'revenue' => $revenue,
            'transactions' => $transactions_count,
            'chart_data' => $monthlyRevenue
        ]);
    }
}
