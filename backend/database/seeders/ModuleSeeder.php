<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use Illuminate\Support\Str;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = ['inventory', 'report'];

        foreach ($modules as $name) {
            Module::create([
                'id' => Str::uuid(),
                'name' => $name,
            ]);
        }
    }
}
