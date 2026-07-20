<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('owner')->after('email');
            $table->enum('staff_status', ['active', 'invited', 'suspended'])->default('active')->after('role');
            $table->timestamp('invited_at')->nullable()->after('staff_status');
            $table->timestamp('last_login_at')->nullable()->after('invited_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'staff_status', 'invited_at', 'last_login_at']);
        });
    }
};
