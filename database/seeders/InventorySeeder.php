<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\StockLevel;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $branchNames = ['Gulshan', 'Uttara', 'Mirpur', 'Chattogram'];
        $branches = collect($branchNames)->mapWithKeys(fn ($name) => [
            $name => Branch::firstOrCreate(['name' => $name], ['is_active' => true]),
        ]);

        $products = Product::with('variants')->get();

        foreach ($products as $product) {
            if ($product->variants->isNotEmpty()) {
                foreach ($product->variants as $variant) {
                    $this->distribute($branches, $product->id, $variant->id, $variant->stock);
                }
            } else {
                $stocks = $product->branch_stocks ?? [];
                foreach ($branchNames as $name) {
                    StockLevel::firstOrCreate(
                        ['product_id' => $product->id, 'variant_id' => null, 'branch_id' => $branches[$name]->id],
                        ['quantity' => (int) ($stocks[$name] ?? 0)],
                    );
                }
            }
        }

        $this->seedBatches($branches);
        $this->seedMovementHistory($branches);
    }

    private function distribute($branches, int $productId, int $variantId, int $totalStock): void
    {
        $names = $branches->keys();
        $base = intdiv($totalStock, $names->count());
        $remainder = $totalStock % $names->count();

        foreach ($names as $index => $name) {
            $qty = $base + ($index < $remainder ? 1 : 0);
            StockLevel::firstOrCreate(
                ['product_id' => $productId, 'variant_id' => $variantId, 'branch_id' => $branches[$name]->id],
                ['quantity' => $qty],
            );
        }
    }

    private function seedBatches($branches): void
    {
        $rice = Product::where('name', 'Chinigura Rice, 5kg')->first();
        $dal = Product::where('name', 'Lentils (Moshur Dal), 1kg')->first();
        $tea = Product::where('name', 'Ispahani Tea, 400g')->first();

        if ($rice && ProductBatch::where('product_id', $rice->id)->count() === 0) {
            ProductBatch::create(['product_id' => $rice->id, 'branch_id' => $branches['Gulshan']->id, 'batch_number' => 'RICE-2601', 'quantity' => 12, 'expiry_date' => Carbon::today()->subDays(5)]);
            ProductBatch::create(['product_id' => $rice->id, 'branch_id' => $branches['Mirpur']->id, 'batch_number' => 'RICE-2602', 'quantity' => 18, 'expiry_date' => Carbon::today()->addDays(4)]);
            ProductBatch::create(['product_id' => $rice->id, 'branch_id' => $branches['Gulshan']->id, 'batch_number' => 'RICE-2603', 'quantity' => 30, 'expiry_date' => Carbon::today()->addDays(90)]);
        }

        if ($dal && ProductBatch::where('product_id', $dal->id)->count() === 0) {
            ProductBatch::create(['product_id' => $dal->id, 'branch_id' => $branches['Uttara']->id, 'batch_number' => 'DAL-1140', 'quantity' => 40, 'expiry_date' => Carbon::today()->addDays(6)]);
            ProductBatch::create(['product_id' => $dal->id, 'branch_id' => $branches['Chattogram']->id, 'batch_number' => 'DAL-1141', 'quantity' => 25, 'expiry_date' => Carbon::today()->addDays(60)]);
        }

        if ($tea && ProductBatch::where('product_id', $tea->id)->count() === 0) {
            ProductBatch::create(['product_id' => $tea->id, 'branch_id' => $branches['Gulshan']->id, 'batch_number' => 'TEA-0087', 'quantity' => 9, 'expiry_date' => Carbon::today()->addDays(10)]);
        }
    }

    private function seedMovementHistory($branches): void
    {
        if (StockMovement::count() > 0) {
            return;
        }

        $user = User::first();
        $rice = Product::where('name', 'Chinigura Rice, 5kg')->first();
        $oil = Product::where('name', 'Cooking Oil, 5L')->first();
        $water = Product::where('name', 'Mineral Water, 1.5L')->first();
        $detergent = Product::where('name', 'Detergent Powder, 1kg')->first();

        $events = [
            ['product' => $rice, 'branch' => 'Gulshan', 'type' => 'adjustment', 'delta' => -3, 'reason' => 'damage', 'notes' => 'Torn bag found during shelf check', 'days_ago' => 6],
            ['product' => $oil, 'branch' => 'Mirpur', 'type' => 'adjustment', 'delta' => 12, 'reason' => 'correction', 'notes' => 'Recount after supplier delivery', 'days_ago' => 5],
            ['product' => $water, 'branch' => 'Uttara', 'type' => 'adjustment', 'delta' => -2, 'reason' => 'return', 'notes' => 'Customer return, damaged seal', 'days_ago' => 3],
            ['product' => $detergent, 'branch' => 'Chattogram', 'type' => 'adjustment', 'delta' => 5, 'reason' => 'other', 'notes' => 'Manual stock top-up', 'days_ago' => 2],
        ];

        foreach ($events as $event) {
            if (! $event['product']) {
                continue;
            }
            StockMovement::create([
                'product_id' => $event['product']->id,
                'branch_id' => $branches[$event['branch']]->id,
                'type' => $event['type'],
                'quantity_delta' => $event['delta'],
                'reason' => $event['reason'],
                'notes' => $event['notes'],
                'user_id' => $user?->id,
                'created_at' => Carbon::now()->subDays($event['days_ago']),
                'updated_at' => Carbon::now()->subDays($event['days_ago']),
            ]);
        }

        if ($rice) {
            $transferQty = 8;
            StockMovement::create([
                'product_id' => $rice->id,
                'branch_id' => $branches['Mirpur']->id,
                'related_branch_id' => $branches['Gulshan']->id,
                'type' => 'transfer_out',
                'quantity_delta' => -$transferQty,
                'reason' => 'transfer',
                'notes' => 'Balancing stock ahead of the weekend',
                'user_id' => $user?->id,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ]);
            StockMovement::create([
                'product_id' => $rice->id,
                'branch_id' => $branches['Gulshan']->id,
                'related_branch_id' => $branches['Mirpur']->id,
                'type' => 'transfer_in',
                'quantity_delta' => $transferQty,
                'reason' => 'transfer',
                'notes' => 'Balancing stock ahead of the weekend',
                'user_id' => $user?->id,
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ]);
        }
    }
}
