<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\Module;
use App\Models\TenantModule;
use Illuminate\Support\Str;

class TenantModuleSeeder extends Seeder
{
    public function run(): void
    {
        $nesa = Tenant::where('name', 'Nesa Food')->first();
        $jaya = Tenant::where('name', 'Warung Makan Jaya')->first();

        $inventory = Module::where('name', 'inventory')->first();
        $report = Module::where('name', 'report')->first();

        if ($nesa && $inventory) {
            TenantModule::create([
                'id' => Str::uuid(),
                'tenant_id' => $nesa->id,
                'module_id' => $inventory->id,
                'is_active' => true,
            ]);
        }

        if ($jaya && $inventory) {
            TenantModule::create([
                'id' => Str::uuid(),
                'tenant_id' => $jaya->id,
                'module_id' => $inventory->id,
                'is_active' => false, // Nonaktif
            ]);
        }
    }
}
