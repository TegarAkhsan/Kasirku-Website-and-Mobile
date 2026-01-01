<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class XenditService
{
    protected $secretKey;

    protected $useMock;

    public function __construct()
    {
        $this->secretKey = config('services.xendit.secret_key');
        $this->useMock = config('services.xendit.use_mock');
    }

    private function http()
    {
        return Http::withBasicAuth($this->secretKey, '')->withoutVerifying();
    }

    public function createInvoice($transaction)
    {
        // Legacy Invoice Method (for fallback or general use)
        if ($this->useMock) {
            return $this->mockResponse($transaction, 'invoice');
        }

        $response = $this->http()->post('https://api.xendit.co/v2/invoices', [
            'external_id' => $transaction->transaction_code,
            'amount' => $transaction->total_amount,
            'description' => 'Payment ' . $transaction->transaction_code,
            'currency' => 'IDR'
        ]);

        return $response->throw()->json();
    }

    public function createQRCode($transaction)
    {
        if ($this->useMock) {
            return $this->mockResponse($transaction, 'qris');
        }

        // API Version Header is often required for specific behavior, good practice to include
        $headers = ['api-version' => '2022-07-31'];

        // DEBUG LOGGING
        \Illuminate\Support\Facades\Log::info('Xendit QR DEBUG:', [
            'trx_code_raw' => $transaction->transaction_code,
            'trx_amount' => $transaction->total_amount,
            'reference_id' => (string) $transaction->transaction_code
        ]);

        $payload = [
            'reference_id' => (string) $transaction->transaction_code,
            'type' => 'DYNAMIC',
            'amount' => (int) $transaction->total_amount,
            'currency' => 'IDR',
        ];

        $response = $this->http()->withHeaders($headers)->post('https://api.xendit.co/qr_codes', $payload);

        if ($response->failed()) {
            \Illuminate\Support\Facades\Log::error('Xendit QR Error Response: ' . $response->body());
            $response->throw();
        }

        return $response->json();
    }

    public function createVirtualAccount($transaction, $bankCode)
    {
        if ($this->useMock) {
            return $this->mockResponse($transaction, 'bank');
        }

        $payload = [
            'external_id' => (string) $transaction->transaction_code,
            'bank_code' => strtoupper($bankCode),
            'name' => 'Order ' . $transaction->transaction_code,
            'expected_amount' => (int) $transaction->total_amount,
            'is_closed' => true,
            'expiration_date' => now()->addDay()->toISOString(),
        ];

        $response = $this->http()->post('https://api.xendit.co/callback_virtual_accounts', $payload);

        if ($response->failed()) {
            \Illuminate\Support\Facades\Log::error('Xendit VA Error Response: ' . $response->body());
            $response->throw();
        }

        return $response->json();
    }

    public function getInvoice($externalId)
    {
        // We'll stick to invoice check for generic status sync, or implementation specific checks could be added
        if ($this->useMock) {
            return null;
        }

        $response = $this->http()->get('https://api.xendit.co/v2/invoices', [
            'external_id' => $externalId
        ]);

        if ($response->successful()) {
            $invoices = $response->json();
            return $invoices[0] ?? null;
        }
        return null;
    }

    private function mockResponse($transaction, $type)
    {
        if ($type === 'qris') {
            return ['qr_string' => 'mock_qr_string_' . $transaction->id, 'status' => 'ACTIVE'];
        }
        if ($type === 'bank') {
            return ['account_number' => '888899990000', 'status' => 'PENDING', 'bank_code' => 'MOCKBANK'];
        }
        return ['invoice_url' => '/mock-payment/' . $transaction->id, 'status' => 'PENDING'];
    }
}
