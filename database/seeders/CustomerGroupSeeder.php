<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Models\LoyaltyLedgerEntry;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Seeder;

class CustomerGroupSeeder extends Seeder
{
    public function run(): void
    {
        if (CustomerGroup::count() > 0) {
            return;
        }

        $retail = CustomerGroup::create(['name' => 'Retail', 'discount_percent' => 0, 'description' => 'Standard walk-in and occasional shoppers.']);
        $wholesale = CustomerGroup::create(['name' => 'Wholesale', 'discount_percent' => 10, 'description' => 'Bulk buyers and repeat business accounts.']);
        $vip = CustomerGroup::create(['name' => 'VIP', 'discount_percent' => 15, 'description' => 'Highest-spend, priority customers.']);

        $userId = User::first()?->id;
        $customers = Customer::withCount('sales')->get()->sortByDesc(fn (Customer $c) => $c->total_spend)->values();

        foreach ($customers as $index => $customer) {
            $group = match (true) {
                $index < 2 => $vip,
                $index < 4 => $wholesale,
                default => $retail,
            };
            $customer->update(['customer_group_id' => $group->id]);

            $balance = 0;
            $sales = Sale::where('customer_id', $customer->id)->whereIn('status', ['completed', 'refunded'])->orderBy('sold_at')->get();

            foreach ($sales as $sale) {
                $earned = (int) floor((float) $sale->total / 100);
                if ($earned <= 0) {
                    continue;
                }
                $balance += $earned;

                LoyaltyLedgerEntry::create([
                    'customer_id' => $customer->id,
                    'sale_id' => $sale->id,
                    'type' => 'earned',
                    'points' => $earned,
                    'reason' => "Earned from {$sale->sale_number}",
                    'created_by' => null,
                    'created_at' => $sale->sold_at,
                    'updated_at' => $sale->sold_at,
                ]);
            }

            if ($balance > 50 && rand(1, 100) <= 60) {
                $redeemed = min($balance, rand(20, 80));
                $balance -= $redeemed;

                LoyaltyLedgerEntry::create([
                    'customer_id' => $customer->id,
                    'sale_id' => null,
                    'type' => 'redeemed',
                    'points' => -$redeemed,
                    'reason' => 'Redeemed for in-store discount',
                    'created_by' => $userId,
                ]);
            }

            if (rand(1, 100) <= 25) {
                $bonus = rand(10, 30);
                $balance += $bonus;

                LoyaltyLedgerEntry::create([
                    'customer_id' => $customer->id,
                    'sale_id' => null,
                    'type' => 'adjusted',
                    'points' => $bonus,
                    'reason' => 'Birthday bonus points',
                    'created_by' => $userId,
                ]);
            }

            $customer->update(['loyalty_points' => max(0, $balance)]);
        }
    }
}
