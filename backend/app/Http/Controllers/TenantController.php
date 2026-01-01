<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index()
    {
        return response()->json(Tenant::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $tenant = Tenant::create($validated);
        return response()->json($tenant, 201);
    }

    public function show(Tenant $tenant)
    {
        return response()->json($tenant);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'string',
            'status' => 'in:active,suspended',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        $tenant->update($validated);
        return response()->json($tenant);
    }
}
