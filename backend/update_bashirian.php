<?php
$tid = '019b5fdd-7cc5-73aa-ba9f-0713ab4de0d2';
$s = \App\Models\ReceiptSetting::withoutGlobalScope('tenant')->where('tenant_id', $tid)->first();
if (!$s) {
    $s = new \App\Models\ReceiptSetting();
    $s->tenant_id = $tid;
}
$s->header_text = 'CONFIRMED BASHIRIAN USER';
$s->address = 'Debug Address';
$s->save();
echo "Updated Bashirian Settings.\n";
