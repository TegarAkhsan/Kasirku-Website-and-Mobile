<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\Product;
use App\Models\InventoryLog;

class InventoryLogSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $products = Product::where('tenant_id', $tenant->id)->get();

            foreach ($products as $product) {
                InventoryLog::factory(rand(2, 5))->create([
                    'tenant_id' => $tenant->id,
                    'product_id' => $product->id,
                ]);
            }
        }
    }
}
