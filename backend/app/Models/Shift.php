<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Traits\HasTenant;

class Shift extends Model
{
    use HasFactory, HasUuids, HasTenant;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'start_time',
        'end_time',
        'start_cash',
        'end_cash',
        'total_sales',
        'cash_sales',
        'status', // open, closed
        'notes'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
