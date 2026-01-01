<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // 1. Super Admin (Global)
        User::create([
            'id' => Str::uuid(),
            'tenant_id' => '99999999-9999-9999-9999-999999999991', // Linked to Nesa Food for simplicity or null if nullable
            'name' => 'Super Admin',
            'email' => 'admin@pos.com',
            'password' => $password,
            'role' => 'admin',
            'status' => true,
        ]);

        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            // Owner
            User::create([
                'id' => Str::uuid(),
                'tenant_id' => $tenant->id,
                'name' => 'Owner ' . $tenant->name,
                'email' => 'owner.' . Str::slug($tenant->name) . '@pos.com',
                'password' => $password,
                'role' => 'owner',
                'status' => true,
            ]);

            // 2 Cashiers
            User::factory(2)->create([
                'tenant_id' => $tenant->id,
                'password' => $password,
                'role' => 'kasir',
                'status' => true,
            ]);
        }
    }
}
