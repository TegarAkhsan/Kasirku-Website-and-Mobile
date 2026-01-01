<?php
$user = \App\Models\User::where('name', 'like', '%Nesa%')->orWhere('role', 'owner')->get();
foreach ($user as $u) {
    echo "Found User: " . $u->name . " | ID: " . $u->id . " | Tenant: " . $u->tenant_id . "\n";
    auth()->login($u);
    $s = \App\Models\ReceiptSetting::first();
    echo "  > Settings for this user: " . ($s ? "FOUND (Header: {$s->header_text})" : "NULL") . "\n";
}

$all = \App\Models\ReceiptSetting::withoutGlobalScope('tenant')->get();
echo "--- ALL SETTINGS ---\n";
foreach ($all as $s) {
    echo "ID: " . $s->id . " | Tenant: " . $s->tenant_id . " | Header: " . $s->header_text . "\n";
}
