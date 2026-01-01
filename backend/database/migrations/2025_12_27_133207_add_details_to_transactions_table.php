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
            $table->string('table_number')->nullable()->after('user_id');
            $table->text('notes')->nullable()->after('table_number');
            // We need to modify the enum. In Postgres/MySQL raw ID might be needed, 
            // but for simplicity in Laravel migration we can just drop and recreate or change type.
            // Since this is dev, let's just alter it or add validation in app level and cast to string in DB if needed.
            // But cleanest for existing data is:
            $table->string('payment_method')->change(); // Change to string to support any new method
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['table_number', 'notes']);
        });
    }
};
