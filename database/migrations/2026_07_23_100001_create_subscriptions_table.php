<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('plan');
            $table->enum('billing_cycle', ['monthly', 'yearly'])->default('monthly');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['trial', 'active', 'grace', 'suspended'])->default('trial');
            $table->date('current_period_start');
            $table->date('current_period_end');
            $table->date('trial_ends_at')->nullable();
            $table->date('grace_ends_at')->nullable();
            $table->boolean('reminder_email')->default(true);
            $table->boolean('reminder_sms')->default(false);
            $table->unsignedTinyInteger('reminder_days_before')->default(3);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
