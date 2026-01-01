<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            // 10-15 Products
            Product::factory(rand(10, 15))->create([
                'tenant_id' => $tenant->id,
            ]);

            // Specific products for demo
            Product::factory()->create([
                'tenant_id' => $tenant->id,
                'name' => 'Nasi Goreng Spesial',
                'price' => 25000,
                'stock' => 50,
            ]);

            Product::factory()->create([
                'tenant_id' => $tenant->id,
                'name' => 'Es Teh Manis',
                'price' => 5000,
                'stock' => 100,
            ]);
        }
    }
}
