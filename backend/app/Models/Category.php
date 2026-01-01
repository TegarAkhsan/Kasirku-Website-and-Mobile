<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Traits\HasTenant;

class Category extends Model
{
    use HasFactory, HasUuids, HasTenant;

    protected $guarded = ['id'];
    //
}
