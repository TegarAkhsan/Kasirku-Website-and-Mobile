<?php

namespace App\Http\Controllers;

use App\Models\ReceiptSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReceiptSettingController extends Controller
{
    public function show(Request $request)
    {
        // Global scope handles tenant filter
        \Illuminate\Support\Facades\Log::info('ReceiptSetting Show: User', ['id' => $request->user()->id, 'tenant_id' => $request->user()->tenant_id]);

        $settings = ReceiptSetting::first();

        \Illuminate\Support\Facades\Log::info('ReceiptSetting Found:', ['settings' => $settings]);

        if (!$settings) {
            \Illuminate\Support\Facades\Log::info('ReceiptSetting: Using Fallback');
            // Return empty defaults
            return response()->json([
                'show_logo' => false,
                'header_text' => $request->user()->tenant?->name ?? 'My Shop',
                'paper_size' => '58mm'
            ]);
        }

        // Append full URL for logo
        $data = $settings->toArray();
        if ($settings->logo_path) {
            $data['logo_url'] = Storage::url($settings->logo_path);
        }

        return response()->json($data);
    }

    public function update(Request $request)
    {
        $settings = ReceiptSetting::first();
        if (!$settings) {
            $settings = new ReceiptSetting();
            $settings->tenant_id = $request->user()->tenant_id;
        }

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            // Delete old if exists
            if ($settings->logo_path) {
                Storage::delete($settings->logo_path);
            }
            $path = $request->file('logo')->store('receipts', 'public');
            $settings->logo_path = $path;
        }

        $settings->show_logo = $request->boolean('show_logo');
        $settings->header_text = $request->header_text;
        $settings->address = $request->address;
        $settings->footer_text = $request->footer_text;
        $settings->show_wifi = $request->boolean('show_wifi');
        $settings->wifi_ssid = $request->wifi_ssid;
        $settings->wifi_password = $request->wifi_password;
        $settings->paper_size = $request->paper_size ?? '58mm';

        $settings->save();

        return response()->json($settings);
    }
}