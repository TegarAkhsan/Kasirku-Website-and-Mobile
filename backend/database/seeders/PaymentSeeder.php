<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Only for QRIS transactions
        $transactions = Transaction::where('payment_method', 'qris')->get();

        foreach ($transactions as $transaction) {
            Payment::factory()->create([
                'transaction_id' => $transaction->id,
                'amount' => $transaction->total_amount,
                'status' => $transaction->payment_status,
            ]);
        }
    }
}
