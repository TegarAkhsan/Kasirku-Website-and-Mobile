<?php

namespace App\Models\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;

trait HasTenant
{
    protected static function bootHasTenant()
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            // Assuming we store tenant_id in the request or session, or auth user
            if (auth()->check()) {
                $user = auth()->user();
                if ($user->tenant_id && $user->role !== 'super_admin') {
                    $builder->where('tenant_id', $user->tenant_id);
                }
            }
        });

        static::creating(function ($model) {
            if (auth()->check()) {
                $user = auth()->user();
                // If model doesn't have tenant_id set, and user has one, assign it.
                if (!$model->tenant_id && $user->tenant_id) {
                    $model->tenant_id = $user->tenant_id;
                }
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
