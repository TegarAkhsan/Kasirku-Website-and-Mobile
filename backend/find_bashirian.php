<?php
$t = \App\Models\Tenant::where('name', 'like', '%Bashirian%')->first();
if ($t) {
    echo "Found Bashirian Tenant: " . $t->name . " | ID: " . $t->id . "\n";
    $users = \App\Models\User::where('tenant_id', $t->id)->get();
    foreach ($users as $u) {
        echo "  User: " . $u->name . " (" . $u->role . ")\n";
    }
} else {
    echo "No Bashirian Tenant found.\n";
}
