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
        // For PostgreSQL
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_payment_method_check");
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_payment_method_check CHECK (payment_method IN ('cash', 'qris', 'bank'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_payment_method_check");
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_payment_method_check CHECK (payment_method IN ('cash', 'qris'))");
    }
};
