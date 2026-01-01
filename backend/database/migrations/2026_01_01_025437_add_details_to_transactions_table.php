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
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'transaction_code')) {
                $table->string('transaction_code')->unique()->nullable()->after('user_id'); // Made nullable initially to be safe, or just truncate again? I already truncated. So unique is fine.
            }
            if (!Schema::hasColumn('transactions', 'amount_paid')) {
                $table->decimal('amount_paid', 15, 2)->default(0)->after('payment_status');
            }
            if (!Schema::hasColumn('transactions', 'change_amount')) {
                $table->decimal('change_amount', 15, 2)->default(0)->after('amount_paid');
            }
            if (!Schema::hasColumn('transactions', 'notes')) {
                $table->text('notes')->nullable()->after('change_amount');
            }
            if (!Schema::hasColumn('transactions', 'table_number')) {
                $table->string('table_number')->nullable()->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['transaction_code', 'amount_paid', 'change_amount', 'notes', 'table_number']);
        });
    }
};
