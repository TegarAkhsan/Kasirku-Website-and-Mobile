<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_tenants' => Tenant::count(),
            'total_revenue' => Transaction::where('payment_status', 'success')->sum('total_amount'), // Global revenue
            'active_users' => User::where('status', true)->count(),
            'recent_tenants' => Tenant::latest()->take(5)->get()
        ]);
    }

    public function tenants()
    {
        return response()->json(Tenant::with('owner')->latest()->get());
    }
}
