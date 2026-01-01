<?php
$owner = \App\Models\User::where('name', 'like', '%Nesa%')->where('role', 'owner')->first();
if ($owner) {
    echo "Creating Cashier for Tenant: " . $owner->tenant_id . "\n";
    // Check if exists first to avoid duplicate errors
    $exists = \App\Models\User::where('email', 'cashier@nesa.com')->first();
    if ($exists) {
        echo "Cashier already exists: " . $exists->email . "\n";
        exit;
    }

    $cashier = \App\Models\User::create([
        'name' => 'Cashier Nesa',
        'email' => 'cashier@nesa.com',
        'password' => bcrypt('password'),
        'role' => 'kasir', // CORRECTED Enum Value
        'tenant_id' => $owner->tenant_id
    ]);
    echo "Created Cashier: " . $cashier->email . " | Password: password\n";
} else {
    echo "Owner Nesa not found.\n";
}
