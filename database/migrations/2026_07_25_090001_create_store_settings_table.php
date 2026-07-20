<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Store profile
            $table->string('store_name');
            $table->string('logo_path')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->json('business_hours')->nullable();

            // Receipt
            $table->boolean('receipt_logo_enabled')->default(true);
            $table->string('receipt_header')->nullable();
            $table->text('receipt_footer')->nullable();

            // Tax
            $table->boolean('tax_inclusive')->default(false);
            $table->json('tax_classes')->nullable();

            // Currency & localization
            $table->string('currency_symbol')->default('৳');
            $table->string('currency_code')->default('BDT');
            $table->string('date_format')->default('d M Y');
            $table->string('timezone')->default('Asia/Dhaka');

            // Data & backup
            $table->timestamp('last_backup_at')->nullable();

            // Notifications
            $table->boolean('notify_low_stock')->default(true);
            $table->boolean('notify_daily_sales_email')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_settings');
    }
};
