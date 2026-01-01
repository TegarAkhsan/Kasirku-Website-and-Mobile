<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Traits\HasTenant;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, HasUuids, HasTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'transaction_code',
        'total_amount',
        'payment_method',
        'payment_status',
        'amount_paid',
        'change_amount',
        'notes',
        'table_number'
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
