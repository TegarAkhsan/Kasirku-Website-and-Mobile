<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function current(Request $request)
    {
        $shift = Shift::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->first();

        return response()->json($shift);
    }

    public function start(Request $request)
    {
        if (Shift::where('user_id', $request->user()->id)->where('status', 'open')->exists()) {
            return response()->json(['message' => 'Shift already open'], 400);
        }

        $shift = Shift::create([
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->user()->id,
            'start_time' => now(),
            'start_cash' => $request->start_cash ?? 0,
            'status' => 'open'
        ]);

        return response()->json($shift);
    }

    public function close(Request $request)
    {
        $shift = Shift::where('user_id', $request->user()->id)
            ->where('status', 'open')
            ->firstOrFail();

        $stats = $this->calculateStats($request->user()->id, $shift->start_time);

        $shift->update([
            'end_time' => now(),
            'end_cash' => $request->end_cash ?? 0,
            'total_sales' => $stats['total_sales'],
            'cash_sales' => $stats['cash_sales'],
            'status' => 'closed'
        ]);

        return response()->json($shift);
    }

    private function calculateStats($userId, $startTime)
    {
        $txs = Transaction::where('user_id', $userId)
            ->where('created_at', '>=', $startTime)
            ->where('payment_status', 'success')
            ->get();

        return [
            'total_sales' => $txs->sum('total_amount'),
            'cash_sales' => $txs->where('payment_method', 'cash')->sum('total_amount')
        ];
    }
}