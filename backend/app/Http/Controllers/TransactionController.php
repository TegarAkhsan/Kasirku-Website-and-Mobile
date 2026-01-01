<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // Global Scope handles tenant_id automatically (via HasTenant)
        $query = Transaction::with('items.product');

        if ($request->user()->role === 'kasir') {
            $query->whereRaw("user_id = ?", [$request->user()->id]);

            // Only show transactions from the CURRENT OPEN SHIFT
            $currentShift = \App\Models\Shift::where('user_id', $request->user()->id)
                ->where('status', 'open')
                ->first();

            if ($currentShift) {
                // Show transactions created since shift started
                $query->where('created_at', '>=', $currentShift->start_time);
            } else {
                // No open shift? Then effectively no "active" transactions to show.
                // Using a condition that's always false to return empty result
                $query->whereRaw('1 = 0');
            }
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(10));
    }

    public function show(Request $request, $id)
    {
        $transaction = Transaction::with('items.product')->where('user_id', $request->user()->id)->findOrFail($id);

        // Sync Status with Xendit if Pending
        if ($transaction->payment_status === 'pending' && $transaction->payment_method !== 'cash') {
            try {
                $xendit = new \App\Services\XenditService();
                // Note: getInvoice only works for INVOICE type. 
                // For QR/VA we might need different checks, but for now we leave it or adapt.
                // Or we can just rely on webhooks for QR/VA.
                // But let's keep the getInvoice call for legacy compatibility or if we switch back.
                // However, createQRCode doesn't create an "invoice". 
                // So this status check might fail for QR/VA.
                // Recommendation: rely on manual check or webhook.
            } catch (\Exception $e) {
                // Ignore error
            }
        }

        return response()->json($transaction);
    }

    public function mockPay(Request $request, $id)
    {
        // Only allow if Mock Mode is enabled
        if (!config('services.xendit.use_mock')) {
            return response()->json(['message' => 'Mock mode disabled'], 403);
        }

        $transaction = Transaction::where('user_id', $request->user()->id)->findOrFail($id);
        $transaction->update(['payment_status' => 'success']);

        return response()->json(['message' => 'Payment Simulated Successfully', 'transaction' => $transaction]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'payment_method' => 'required|string', // cash, qris, bank
                'amount_paid' => 'required|numeric',
                'notes' => 'nullable|string',
                'table_number' => 'nullable|string',
                'bank_name' => 'nullable|string|in:bca,bni,bri,permata,mandiri'
            ]);

            // Ensure Open Shift Exists
            $currentShift = \App\Models\Shift::where('user_id', $request->user()->id)
                ->where('status', 'open')
                ->first();

            if (!$currentShift) {
                // Auto-start shift
                \App\Models\Shift::create([
                    'tenant_id' => $request->user()->tenant_id,
                    'user_id' => $request->user()->id,
                    'start_time' => now(),
                    'start_cash' => 0, // Default 0 for auto-start
                    'status' => 'open'
                ]);
            }

            return DB::transaction(function () use ($validated, $request) {
                $totalAmount = 0;
                $itemsToInsert = [];

                // Calculate Total & Check Stock
                foreach ($validated['items'] as $itemData) {
                    $product = Product::lockForUpdate()->find($itemData['product_id']);

                    if ($product->stock < $itemData['quantity']) {
                        throw new \Exception('Insufficient stock for ' . $product->name);
                    }

                    $subtotal = $product->price * $itemData['quantity'];
                    $totalAmount += $subtotal;

                    $itemsToInsert[] = [
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $product->price
                    ];

                    $product->decrement('stock', $itemData['quantity']);
                }

                // Create Transaction
                $transaction = Transaction::create([
                    'tenant_id' => $request->user()->tenant_id,
                    'user_id' => $request->user()->id,
                    'transaction_code' => 'TRX-' . time(),
                    'total_amount' => $totalAmount,
                    'payment_method' => $validated['payment_method'],
                    'payment_status' => $validated['payment_method'] === 'cash' ? 'success' : 'pending',
                    'amount_paid' => $validated['amount_paid'],
                    'change_amount' => $validated['amount_paid'] - $totalAmount,
                    'notes' => $validated['notes'] ?? null,
                    'table_number' => $validated['table_number'] ?? null,
                ]);

                $transaction->items()->createMany($itemsToInsert);

                $paymentResponse = null;

                // Handle Xendit Payment
                if ($validated['payment_method'] === 'qris') {
                    $xendit = new \App\Services\XenditService();
                    try {
                        $qr = $xendit->createQRCode($transaction);
                        $paymentResponse = [
                            'type' => 'qris',
                            'qr_string' => $qr['qr_string'],
                            'status' => $qr['status'] ?? 'PENDING'
                        ];
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Xendit QR Error: ' . $e->getMessage());
                        throw $e;
                    }
                } elseif ($validated['payment_method'] === 'bank') {
                    $xendit = new \App\Services\XenditService();
                    try {
                        // Default to BCA or use bank_name from request
                        $bankCode = $validated['bank_name'] ?? 'BCA';
                        $va = $xendit->createVirtualAccount($transaction, $bankCode);
                        $paymentResponse = [
                            'type' => 'bank_transfer',
                            'account_number' => $va['account_number'],
                            'bank_code' => $va['bank_code'],
                            'expiration_date' => $va['expiration_date'] ?? null,
                            'status' => $va['status'] ?? 'PENDING'
                        ];
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('Xendit VA Error: ' . $e->getMessage());
                        throw $e;
                    }
                }

                return response()->json([
                    'transaction' => $transaction->load('items.product'),
                    'payment_info' => $paymentResponse
                ], 201);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Transaction Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }
}
