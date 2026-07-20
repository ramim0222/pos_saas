<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('address');
            $table->foreignId('manager_id')->nullable()->after('phone')->constrained('users')->nullOnDelete();
            $table->json('business_hours')->nullable()->after('manager_id');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_id');
            $table->dropColumn(['phone', 'business_hours']);
        });
    }
};
