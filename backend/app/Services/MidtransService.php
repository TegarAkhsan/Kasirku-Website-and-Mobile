<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\CoreApi;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // Fix for Local Windows Development (cURL SSL Error)
        // DANGER: Only for development!
        if (!Config::$isProduction) {
            Config::$curlOptions = [
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0
            ];
        }
    }

    public function getSnapToken($transaction)
    {
        // ... existing Snap logic ...
        $params = [
            'transaction_details' => [
                'order_id' => $transaction->transaction_code . '-' . time(),
                'gross_amount' => (int) $transaction->total_amount,
            ],
            'customer_details' => [
                'first_name' => 'Customer',
                'email' => 'customer@example.com',
            ],
        ];
        return Snap::getSnapToken($params);
    }

    public function charge($transaction, $method, $bank = null)
    {
        $params = [
            'payment_type' => $method, // 'bank_transfer' or 'qris'
            'transaction_details' => [
                'order_id' => $transaction->transaction_code . '-' . time(),
                'gross_amount' => (int) $transaction->total_amount,
            ],
            'customer_details' => [
                'first_name' => 'Customer',
                'email' => 'customer@example.com',
            ],
        ];

        if ($method === 'bank_transfer') {
            $params['bank_transfer'] = ['bank' => $bank];
        }

        if ($method === 'qris') {
            $params['qris'] = ['acquirer' => 'gopay']; // Standard for Core API
        }

        return CoreApi::charge($params);
    }
}
