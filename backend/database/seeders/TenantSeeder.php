<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Nesa Food
        Tenant::factory()->create([
            'id' => '99999999-9999-9999-9999-999999999991', // Fixed UUID for testing
            'name' => 'Nesa Food',
            'phone' => '081234567890',
        ]);

        // 2. Warung Makan Jaya
        Tenant::factory()->create([
            'id' => '99999999-9999-9999-9999-999999999992', // Fixed UUID for testing
            'name' => 'Warung Makan Jaya',
            'phone' => '089876543210',
        ]);

        // 3. Random Tenant
        Tenant::factory()->create();
    }
}
