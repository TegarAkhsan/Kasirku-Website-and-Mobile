<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $cashiers = User::where('tenant_id', $tenant->id)->where('role', 'kasir')->get();
            $products = Product::where('tenant_id', $tenant->id)->get();

            if ($cashiers->isEmpty() || $products->isEmpty())
                continue;

            // 20-50 Transactions
            $count = rand(20, 50);

            for ($i = 0; $i < $count; $i++) {
                $cashier = $cashiers->random();
                $itemsCount = rand(1, 5);
                $selectedProducts = $products->random($itemsCount);
                $total = 0;

                $transaction = Transaction::factory()->create([
                    'tenant_id' => $tenant->id,
                    'user_id' => $cashier->id,
                    'total_amount' => 0, // Will update after items
                ]);

                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $subtotal = $product->price * $qty;
                    $total += $subtotal;

                    TransactionItem::create([
                        'id' => Str::uuid(),
                        'transaction_id' => $transaction->id,
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'price' => $product->price,
                    ]);
                }

                $transaction->update(['total_amount' => $total]);
            }
        }
    }
}
