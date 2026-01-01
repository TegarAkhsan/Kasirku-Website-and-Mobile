<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('receipt_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();

            $table->boolean('show_logo')->default(false);
            $table->string('logo_path')->nullable();
            $table->text('header_text')->nullable(); // Address/Contact
            $table->text('footer_text')->nullable(); // Thank you note

            $table->boolean('show_wifi')->default(false);
            $table->string('wifi_ssid')->nullable();
            $table->string('wifi_password')->nullable();

            $table->enum('paper_size', ['58mm', '80mm'])->default('58mm');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipt_settings');
    }
};
