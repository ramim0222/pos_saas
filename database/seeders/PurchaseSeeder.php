<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StockLevel;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        if (Supplier::count() > 0) {
            return;
        }

        $userId = User::first()?->id;
        $branches = Branch::pluck('id', 'name');
        $products = Product::all();

        $suppliers = collect([
            ['name' => 'Meghna Wholesale Traders', 'contact_person' => 'Jashim Uddin', 'phone' => '01711-223344', 'email' => 'jashim@meghnawholesale.com', 'address' => 'Karwan Bazar, Dhaka', 'payment_terms' => 'Net 15', 'notes' => 'Primary grocery & staples supplier.'],
            ['name' => 'Bengal FMCG Distribution', 'contact_person' => 'Nasrin Akter', 'phone' => '01822-556677', 'email' => 'nasrin@bengalfmcg.com', 'address' => 'Agrabad, Chattogram', 'payment_terms' => 'Net 30', 'notes' => 'Beverages and packaged snacks.'],
            ['name' => 'Padma Agro Foods Ltd.', 'contact_person' => 'Rafiqul Islam', 'phone' => '01933-889900', 'email' => 'rafiq@padmaagro.com.bd', 'address' => 'Savar, Dhaka', 'payment_terms' => 'Due on receipt', 'notes' => 'Rice, dal and cooking oil.'],
            ['name' => 'Chattogram Household Supply Co.', 'contact_person' => 'Farzana Haque', 'phone' => '01611-002233', 'email' => 'farzana@chsupply.com', 'address' => 'Halishahar, Chattogram', 'payment_terms' => 'Net 15', 'notes' => null],
            ['name' => 'Green Valley Tea & Spices', 'contact_person' => 'Mahmudul Hasan', 'phone' => '01755-443322', 'email' => null, 'address' => 'Sreemangal, Sylhet', 'payment_terms' => 'Net 30', 'notes' => 'Seasonal availability for some spices.', 'is_active' => false],
        ])->map(fn ($s) => Supplier::create($s + ['is_active' => $s['is_active'] ?? true]));

        if ($products->isEmpty() || $branches->isEmpty()) {
            return;
        }

        $poDefs = [
            ['supplier' => 0, 'branch' => 'Gulshan', 'status' => 'received', 'daysAgo' => 21, 'delivered' => 18],
            ['supplier' => 2, 'branch' => 'Gulshan', 'status' => 'received', 'daysAgo' => 14, 'delivered' => 11],
            ['supplier' => 1, 'branch' => 'Uttara', 'status' => 'partially_received', 'daysAgo' => 9, 'delivered' => 6],
            ['supplier' => 3, 'branch' => 'Mirpur', 'status' => 'sent', 'daysAgo' => 4, 'delivered' => null],
            ['supplier' => 2, 'branch' => 'Chattogram', 'status' => 'sent', 'daysAgo' => 2, 'delivered' => null],
            ['supplier' => 0, 'branch' => 'Uttara', 'status' => 'draft', 'daysAgo' => 0, 'delivered' => null],
            ['supplier' => 1, 'branch' => 'Gulshan', 'status' => 'cancelled', 'daysAgo' => 27, 'delivered' => null],
        ];

        $poNumber = 1024;

        foreach ($poDefs as $def) {
            $supplier = $suppliers[$def['supplier']];
            $branchId = $branches[$def['branch']];
            $orderDate = Carbon::now()->subDays($def['daysAgo']);

            $po = PurchaseOrder::create([
                'po_number' => 'PO-'.$poNumber++,
                'supplier_id' => $supplier->id,
                'branch_id' => $branchId,
                'created_by' => $userId,
                'status' => $def['status'],
                'order_date' => $orderDate,
                'expected_delivery' => $orderDate->copy()->addDays(5),
                'notes' => $def['status'] === 'cancelled' ? 'Supplier could not fulfil — cancelled.' : null,
                'total_amount' => 0,
            ]);

            $lineProducts = $products->random(min(3, $products->count()));
            $total = 0;

            foreach ($lineProducts as $product) {
                $quantity = rand(10, 60);
                $unitCost = round((float) $product->price * 0.68, 2);
                $receivedQty = match ($def['status']) {
                    'received' => $quantity,
                    'partially_received' => (int) round($quantity * 0.55),
                    default => 0,
                };

                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $product->id,
                    'variant_id' => null,
                    'quantity' => $quantity,
                    'unit_cost' => $unitCost,
                    'received_quantity' => $receivedQty,
                ]);

                $total += $quantity * $unitCost;

                if ($receivedQty > 0) {
                    $level = StockLevel::firstOrCreate(
                        ['product_id' => $product->id, 'variant_id' => null, 'branch_id' => $branchId],
                        ['quantity' => 0],
                    );
                    $level->increment('quantity', $receivedQty);

                    StockMovement::create([
                        'product_id' => $product->id,
                        'variant_id' => null,
                        'branch_id' => $branchId,
                        'type' => 'purchase_receipt',
                        'quantity_delta' => $receivedQty,
                        'reason' => 'purchase',
                        'notes' => "Received against {$po->po_number} from {$supplier->name}",
                        'user_id' => $userId,
                        'created_at' => $def['delivered'] ? Carbon::now()->subDays($def['delivered']) : now(),
                    ]);
                }
            }

            $po->update(['total_amount' => round($total, 2)]);

            if (in_array($def['status'], ['received', 'partially_received'], true)) {
                SupplierPayment::create([
                    'supplier_id' => $supplier->id,
                    'purchase_order_id' => $po->id,
                    'amount' => round($total * ($def['status'] === 'received' ? 0.75 : 0.4), 2),
                    'method' => 'bank_transfer',
                    'notes' => 'Partial settlement against '.$po->po_number,
                    'paid_at' => $orderDate->copy()->addDays($def['delivered'] ? $def['daysAgo'] - $def['delivered'] + 1 : 3),
                ]);
            }
        }
    }
}
