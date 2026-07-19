<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                [
                    'id' => 'active_stores',
                    'label' => 'Active stores',
                    'value' => 214,
                    'change' => 6,
                    'changeLabel' => 'vs yesterday',
                    'format' => 'number',
                ],
                [
                    'id' => 'mrr',
                    'label' => 'Monthly recurring revenue',
                    'value' => 428600,
                    'change' => 3.2,
                    'changeLabel' => 'vs last month',
                    'format' => 'currency',
                ],
                [
                    'id' => 'signups_today',
                    'label' => 'New signups today',
                    'value' => 5,
                    'change' => -2,
                    'changeLabel' => 'vs yesterday',
                    'format' => 'number',
                ],
                [
                    'id' => 'grace_period',
                    'label' => 'Stores in grace period',
                    'value' => 9,
                    'change' => 2,
                    'changeLabel' => 'vs last week',
                    'format' => 'number',
                    'tone' => 'warning',
                ],
            ],
            'revenueTrend' => [
                '7d' => $this->buildRevenueSeries(7),
                '30d' => $this->buildRevenueSeries(30),
            ],
            'topStores' => [
                ['id' => 1, 'name' => 'Uddin General Store', 'plan' => 'Pro', 'monthlyValue' => 2499, 'branches' => 3, 'trend' => 12],
                ['id' => 2, 'name' => 'Akter Grocery — Mirpur', 'plan' => 'Pro', 'monthlyValue' => 2499, 'branches' => 2, 'trend' => 4],
                ['id' => 3, 'name' => 'Hasan Electronics', 'plan' => 'Enterprise', 'monthlyValue' => 6200, 'branches' => 6, 'trend' => 8],
                ['id' => 4, 'name' => 'Sultana Fashion House', 'plan' => 'Pro', 'monthlyValue' => 2499, 'branches' => 1, 'trend' => -3],
                ['id' => 5, 'name' => 'Karim Pharmacy', 'plan' => 'Starter', 'monthlyValue' => 999, 'branches' => 1, 'trend' => 1],
            ],
            'attentionStores' => [
                ['id' => 11, 'name' => 'Nabila Cosmetics', 'plan' => 'Pro', 'status' => 'grace', 'daysLeft' => 3, 'dueAmount' => 2499],
                ['id' => 12, 'name' => 'Chowdhury Hardware', 'plan' => 'Starter', 'status' => 'overdue', 'daysLeft' => 0, 'dueAmount' => 999],
                ['id' => 13, 'name' => 'Islam Mobile Care', 'plan' => 'Pro', 'status' => 'grace', 'daysLeft' => 5, 'dueAmount' => 2499],
                ['id' => 14, 'name' => 'Rahman Bakery', 'plan' => 'Starter', 'status' => 'overdue', 'daysLeft' => 0, 'dueAmount' => 999],
            ],
            'recentPayments' => [
                ['id' => 101, 'store' => 'Uddin General Store', 'plan' => 'Pro', 'amount' => 2499, 'method' => 'bKash', 'time' => '10 minutes ago', 'status' => 'paid'],
                ['id' => 102, 'store' => 'Karim Pharmacy', 'plan' => 'Starter', 'amount' => 999, 'method' => 'bKash', 'time' => '42 minutes ago', 'status' => 'paid'],
                ['id' => 103, 'store' => 'Nabila Cosmetics', 'plan' => 'Pro', 'amount' => 2499, 'method' => 'bKash', 'time' => '1 hour ago', 'status' => 'pending'],
                ['id' => 104, 'store' => 'Hasan Electronics', 'plan' => 'Enterprise', 'amount' => 6200, 'method' => 'bKash', 'time' => '3 hours ago', 'status' => 'paid'],
                ['id' => 105, 'store' => 'Chowdhury Hardware', 'plan' => 'Starter', 'amount' => 999, 'method' => 'bKash', 'time' => '5 hours ago', 'status' => 'failed'],
                ['id' => 106, 'store' => 'Sultana Fashion House', 'plan' => 'Pro', 'amount' => 2499, 'method' => 'bKash', 'time' => 'Yesterday', 'status' => 'paid'],
            ],
            'planDistribution' => [
                ['plan' => 'Starter', 'stores' => 96, 'revenueShare' => 0.22],
                ['plan' => 'Pro', 'stores' => 102, 'revenueShare' => 0.55],
                ['plan' => 'Enterprise', 'stores' => 16, 'revenueShare' => 0.23],
            ],
            'billingPipeline' => [
                'dueThisWeek' => 34,
                'inGracePeriod' => 9,
                'overdue' => 3,
                'failedPayments' => 2,
            ],
        ]);
    }

    private function buildRevenueSeries(int $days): array
    {
        $series = [];
        $base = 12500;

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $wobble = sin($i / 3) * 1400 + (($i * 37) % 900);
            $weekendDip = $date->isWeekend() ? -1800 : 0;

            $series[] = [
                'date' => $date->format('M j'),
                'revenue' => max(4000, (int) round($base + $wobble + $weekendDip + ($days - $i) * 60)),
            ];
        }

        return $series;
    }
}
