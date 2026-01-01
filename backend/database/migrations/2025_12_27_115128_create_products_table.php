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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name')->comment('Nama produk');
            $table->integer('price')->comment('Harga');
            $table->integer('stock')->comment('Stok');
            $table->boolean('is_active')->default(true)->comment('Aktif / tidak');
            $table->timestamps();

            // Remove category_id as it was not in the new specific requirements, or keep if implicit?
            // "3.1 products" table in prompt does NOT list category_id. I will remove it to be strict.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
