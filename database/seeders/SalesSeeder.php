<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\StockLevel;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class SalesSeeder extends Seeder
{
    public function run(): void
    {
        if (Sale::count() > 0) {
            return;
        }

        $cashiers = collect([
            ['name' => 'Rima Chowdhury', 'email' => 'rima@dokan.app'],
            ['name' => 'Kamal Hossain', 'email' => 'kamal@dokan.app'],
        ])->map(fn ($c) => User::firstOrCreate(
            ['email' => $c['email']],
            ['name' => $c['name'], 'password' => Hash::make('password')],
        ));
        $cashiers = $cashiers->concat(User::whereNotIn('email', ['rima@dokan.app', 'kamal@dokan.app'])->get());

        $customers = collect([
            ['name' => 'Shahriar Kabir', 'phone' => '01711-990011', 'email' => 'shahriar@example.com'],
            ['name' => 'Tania Ferdous', 'phone' => '01822-990022', 'email' => 'tania@example.com'],
            ['name' => 'Imran Molla', 'phone' => '01933-990033', 'email' => null],
            ['name' => 'Sabrina Yasmin', 'phone' => '01611-990044', 'email' => 'sabrina@example.com'],
            ['name' => 'Delwar Hossain', 'phone' => '01755-990055', 'email' => null],
        ])->map(fn ($c) => Customer::create($c));

        $branches = Branch::all();
        $products = Product::all();

        if ($branches->isEmpty() || $products->isEmpty()) {
            return;
        }

        $paymentMethods = ['cash', 'card', 'bkash', 'nagad'];
        $saleNumber = 8001;

        for ($i = 0; $i < 42; $i++) {
            $daysAgo = rand(0, 29);
            $soldAt = Carbon::now()->subDays($daysAgo)->setTime(rand(9, 21), rand(0, 59));
            $branch = $branches->random();
            $cashier = $cashiers->random();
            $customer = rand(1, 100) <= 55 ? $customers->random() : null;

            $roll = rand(1, 100);
            $status = $roll <= 8 ? 'refunded' : ($roll <= 14 ? 'voided' : 'completed');

            $lineCount = rand(1, 4);
            $lineProducts = $products->random(min($lineCount, $products->count()));

            $subtotal = 0;
            $items = [];

            foreach ($lineProducts as $product) {
                $quantity = rand(1, 3);
                $unitPrice = (float) $product->price;
                $discount = rand(1, 100) <= 15 ? round($unitPrice * $quantity * 0.05, 2) : 0;
                $lineTotal = round($unitPrice * $quantity - $discount, 2);
                $subtotal += $lineTotal;

                $items[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'discount' => $discount,
                    'line_total' => $lineTotal,
                ];
            }

            $taxTotal = round($subtotal * 0.05, 2);
            $total = round($subtotal + $taxTotal, 2);

            $sale = Sale::create([
                'sale_number' => 'INV-'.$saleNumber++,
                'branch_id' => $branch->id,
                'cashier_id' => $cashier->id,
                'customer_id' => $customer?->id,
                'subtotal' => $subtotal,
                'discount_total' => array_sum(array_column($items, 'discount')),
                'tax_total' => $taxTotal,
                'total' => $total,
                'status' => $status,
                'void_reason' => $status === 'voided' ? 'Cashier entry error — items re-rung' : null,
                'refund_reason' => $status === 'refunded' ? 'Customer returned item(s), unopened' : null,
                'voided_at' => $status === 'voided' ? $soldAt->copy()->addMinutes(rand(2, 20)) : null,
                'refunded_at' => $status === 'refunded' ? $soldAt->copy()->addHours(rand(1, 48)) : null,
                'sold_at' => $soldAt,
                'created_at' => $soldAt,
                'updated_at' => $soldAt,
            ]);

            foreach ($items as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product']->id,
                    'variant_id' => null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount' => $item['discount'],
                    'tax' => round($item['line_total'] * 0.05, 2),
                    'line_total' => $item['line_total'],
                ]);

                $level = StockLevel::firstOrCreate(
                    ['product_id' => $item['product']->id, 'variant_id' => null, 'branch_id' => $branch->id],
                    ['quantity' => 0],
                );
                $soldQty = min($item['quantity'], $level->quantity);
                $level->decrement('quantity', $soldQty);

                StockMovement::create([
                    'product_id' => $item['product']->id,
                    'variant_id' => null,
                    'branch_id' => $branch->id,
                    'type' => 'sale',
                    'quantity_delta' => -$soldQty,
                    'reason' => 'sale',
                    'notes' => "Sold on {$sale->sale_number}",
                    'user_id' => $cashier->id,
                    'created_at' => $soldAt,
                    'updated_at' => $soldAt,
                ]);

                if ($status !== 'completed') {
                    $level->increment('quantity', $soldQty);
                    $reversalAt = $status === 'voided' ? $sale->voided_at : $sale->refunded_at;

                    StockMovement::create([
                        'product_id' => $item['product']->id,
                        'variant_id' => null,
                        'branch_id' => $branch->id,
                        'type' => $status === 'voided' ? 'sale_void' : 'sale_refund',
                        'quantity_delta' => $soldQty,
                        'reason' => $status,
                        'notes' => ($status === 'voided' ? 'Void' : 'Refund')." for {$sale->sale_number}",
                        'user_id' => $cashier->id,
                        'created_at' => $reversalAt,
                        'updated_at' => $reversalAt,
                    ]);
                }
            }

            if ($status !== 'voided') {
                if (rand(1, 100) <= 20) {
                    $splitAmount = round($total / 2, 2);
                    $methods = collect($paymentMethods)->random(2);
                    SalePayment::create(['sale_id' => $sale->id, 'method' => $methods[0], 'amount' => $splitAmount]);
                    SalePayment::create(['sale_id' => $sale->id, 'method' => $methods[1], 'amount' => $total - $splitAmount]);
                } else {
                    SalePayment::create([
                        'sale_id' => $sale->id,
                        'method' => collect($paymentMethods)->random(),
                        'amount' => $total,
                    ]);
                }
            }
        }
    }
}
