<?php

namespace Database\Seeders;

use App\Models\BillingPayment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        if (Subscription::count() > 0) {
            return;
        }

        $user = User::where('email', 'test@example.com')->first();
        if (! $user) {
            return;
        }

        $periodStart = Carbon::now()->subDays(12);
        $periodEnd = $periodStart->copy()->addDays(30);

        Subscription::create([
            'user_id' => $user->id,
            'plan' => 'Pro',
            'billing_cycle' => 'monthly',
            'amount' => 2499,
            'status' => 'active',
            'current_period_start' => $periodStart,
            'current_period_end' => $periodEnd,
            'trial_ends_at' => null,
            'grace_ends_at' => null,
            'reminder_email' => true,
            'reminder_sms' => false,
            'reminder_days_before' => 3,
        ]);

        $history = [
            ['monthsAgo' => 3, 'status' => 'paid', 'txn' => 'BK7X9K2M4P'],
            ['monthsAgo' => 2, 'status' => 'paid', 'txn' => 'BK3N8Q1L7R'],
            ['monthsAgo' => 1, 'status' => 'failed', 'txn' => null],
            ['monthsAgo' => 1, 'status' => 'paid', 'txn' => 'BK5T2W9X6H'],
        ];

        foreach ($history as $entry) {
            $start = Carbon::now()->subMonthsNoOverflow($entry['monthsAgo'])->startOfMonth();
            BillingPayment::create([
                'user_id' => $user->id,
                'plan' => 'Pro',
                'amount' => 2499,
                'period_start' => $start,
                'period_end' => $start->copy()->addDays(30),
                'method' => 'bkash',
                'transaction_id' => $entry['txn'],
                'status' => $entry['status'],
                'paid_at' => $entry['status'] === 'paid' ? $start->copy()->addHours(2) : null,
                'created_at' => $start,
                'updated_at' => $start,
            ]);
        }
    }
}
