<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleXendit(Request $request)
    {
        $token = $request->header('x-callback-token');
        $myToken = config('services.xendit.verification_token');

        if ($token !== $myToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->all();
        Log::info('Xendit Webhook Received:', $data);

        // Handle different webhook formats (legacy vs new)
        // New format often wraps in 'data' and has 'event'
        $payload = $data;
        if (isset($data['data']) && isset($data['event'])) {
            $payload = $data['data'];
        }

        $externalId = $payload['external_id'] ?? null;
        $status = $payload['status'] ?? null;

        if (!$externalId) {
            return response()->json(['message' => 'No external_id found'], 400);
        }

        // Find Transaction
        // Assuming transaction_code matches external_id
        $transaction = Transaction::where('transaction_code', $externalId)->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        // Map status
        // QR Code: 'COMPLETED' or 'PAID' or 'ACTIVE' (created)
        // Bank VA: 'COMPLETED' usually
        // Invoice: 'PAID'

        $paymentStatus = 'pending';
        if (in_array($status, ['PAID', 'COMPLETED', 'SETTLED', 'SUCCEEDED'])) {
            $paymentStatus = 'success';
        } elseif (in_array($status, ['EXPIRED', 'FAILED'])) {
            $paymentStatus = 'failed';
        }

        if ($paymentStatus === 'success' && $transaction->payment_status !== 'success') {
            $transaction->update([
                'payment_status' => 'success',
                'amount_paid' => $payload['amount'] ?? $transaction->total_amount
            ]);
            Log::info("Transaction {$externalId} updated to success.");
        }

        return response()->json(['message' => 'Webhook processed']);
    }
}
