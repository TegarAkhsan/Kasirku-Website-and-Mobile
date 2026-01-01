<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\HasTenant;

class ReceiptSetting extends Model
{
    use HasFactory, HasUuids, HasTenant;

    protected $guarded = ['id'];

    protected $casts = [
        'show_logo' => 'boolean',
        'show_wifi' => 'boolean',
    ];
}
