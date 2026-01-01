<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Traits\HasTenant;

class InventoryLog extends Model
{
    use HasFactory, HasUuids, HasTenant;

    const UPDATED_AT = null;

    protected $guarded = ['id'];
    //
}
