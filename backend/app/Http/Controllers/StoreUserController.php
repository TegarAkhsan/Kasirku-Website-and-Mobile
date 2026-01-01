<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StoreUserController extends Controller
{
    public function index(Request $request)
    {
        // Get users belonging to the same tenant as the owner
        return User::where('tenant_id', $request->user()->tenant_id)
            ->where('role', 'kasir')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users') // Email must be unique globally
            ],
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tenant_id' => $request->user()->tenant_id,
            'role' => 'kasir',
            'status' => true
        ]);

        return response()->json($user, 201);
    }
}
