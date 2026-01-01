<?php
$tid = '019b61f4-4eca-7057-91cd-d4a6684304dc';
$tenant = \App\Models\Tenant::find($tid);
echo "Tenant Name for $tid : " . ($tenant ? $tenant->name : "NOT FOUND") . "\n";
