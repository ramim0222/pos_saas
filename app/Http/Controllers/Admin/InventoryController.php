<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Product;
use App\Models\ProductBatch;
use App\Models\StockLevel;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $branches = Branch::orderBy('name')->get();
        $branchId = $request->input('branch', 'all');

        $products = Product::query()
            ->with(['category', 'variants', 'stockLevels' => function ($query) use ($branchId) {
                if ($branchId !== 'all') {
                    $query->where('branch_id', $branchId);
                }
            }])
            ->orderBy('name')
            ->get();

        $rows = $products->map(function (Product $product) use ($branchId, $branches) {
            $stock = (int) $product->stockLevels->sum('quantity');
            $lastMovement = StockMovement::where('product_id', $product->id)
                ->when($branchId !== 'all', fn ($q) => $q->where('branch_id', $branchId))
                ->latest()
                ->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'has_variants' => $product->variants->isNotEmpty(),
                'reorder_point' => $product->reorder_point,
                'stock' => $stock,
                'status' => $stock <= 0 ? 'out' : ($stock <= $product->reorder_point ? 'low' : 'in_stock'),
                'updated_at' => $lastMovement?->created_at?->diffForHumans() ?? $product->updated_at->diffForHumans(),
                'branch_label' => $branchId === 'all' ? 'All branches' : $branches->firstWhere('id', (int) $branchId)?->name,
            ];
        });

        $summary = [
            'total_skus' => $products->count(),
            'total_stock_value' => (int) $products->sum(fn (Product $p) => $p->stockLevels->sum('quantity') * (float) $p->price),
            'low_stock' => $rows->where('status', 'low')->count(),
            'out_of_stock' => $rows->where('status', 'out')->count(),
        ];

        $pickerProducts = Product::with('variants')->orderBy('name')->get()->map(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'sku' => $p->sku,
            'variants' => $p->variants->map(fn ($v) => ['id' => $v->id, 'name' => $v->name, 'sku' => $v->sku]),
        ]);

        $history = StockMovement::with(['product:id,name', 'variant:id,name', 'branch:id,name', 'relatedBranch:id,name', 'user:id,name'])
            ->when($branchId !== 'all', fn ($q) => $q->where('branch_id', $branchId))
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (StockMovement $m) => [
                'id' => $m->id,
                'product' => $m->product?->name,
                'variant' => $m->variant?->name,
                'branch' => $m->branch?->name,
                'related_branch' => $m->relatedBranch?->name,
                'type' => $m->type,
                'quantity_delta' => $m->quantity_delta,
                'reason' => $m->reason,
                'notes' => $m->notes,
                'user' => $m->user?->name ?? 'System',
                'created_at' => $m->created_at->format('d M, g:i A'),
            ]);

        $stockLevels = StockLevel::query()
            ->select('product_id', 'variant_id', 'branch_id', 'quantity')
            ->get()
            ->map(fn (StockLevel $level) => [
                'product_id' => $level->product_id,
                'variant_id' => $level->variant_id,
                'branch_id' => $level->branch_id,
                'quantity' => $level->quantity,
            ]);

        $batches = ProductBatch::with(['product:id,name', 'branch:id,name'])
            ->when($branchId !== 'all', fn ($q) => $q->where('branch_id', $branchId))
            ->orderBy('expiry_date')
            ->get()
            ->map(fn (ProductBatch $b) => [
                'id' => $b->id,
                'product' => $b->product?->name,
                'branch' => $b->branch?->name,
                'batch_number' => $b->batch_number,
                'quantity' => $b->quantity,
                'expiry_date' => $b->expiry_date?->format('d M Y'),
                'days_until_expiry' => $b->days_until_expiry,
            ]);

        return Inertia::render('Admin/Inventory/Index', [
            'branches' => $branches->map(fn ($b) => ['id' => $b->id, 'name' => $b->name]),
            'selectedBranch' => $branchId,
            'summary' => $summary,
            'rows' => $rows,
            'products' => $pickerProducts,
            'history' => $history,
            'batches' => $batches,
            'stockLevels' => $stockLevels,
        ]);
    }

    public function adjust(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'variant_id' => ['nullable', 'exists:product_variants,id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'type' => ['required', 'in:add,remove'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'in:damage,return,correction,other'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            $level = StockLevel::firstOrCreate(
                ['product_id' => $validated['product_id'], 'variant_id' => $validated['variant_id'] ?? null, 'branch_id' => $validated['branch_id']],
                ['quantity' => 0],
            );

            $delta = $validated['type'] === 'add' ? $validated['quantity'] : -$validated['quantity'];
            $newQuantity = max(0, $level->quantity + $delta);
            $appliedDelta = $newQuantity - $level->quantity;

            $level->update(['quantity' => $newQuantity]);

            StockMovement::create([
                'product_id' => $validated['product_id'],
                'variant_id' => $validated['variant_id'] ?? null,
                'branch_id' => $validated['branch_id'],
                'type' => 'adjustment',
                'quantity_delta' => $appliedDelta,
                'reason' => $validated['reason'],
                'notes' => $validated['notes'] ?? null,
                'user_id' => $request->user()?->id,
            ]);
        });

        return back()->with('status', 'stock-adjusted');
    }

    public function transfer(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'from_branch_id' => ['required', 'exists:branches,id', 'different:to_branch_id'],
            'to_branch_id' => ['required', 'exists:branches,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($validated, $request) {
            foreach ($validated['items'] as $item) {
                $fromLevel = StockLevel::firstOrCreate(
                    ['product_id' => $item['product_id'], 'variant_id' => $item['variant_id'] ?? null, 'branch_id' => $validated['from_branch_id']],
                    ['quantity' => 0],
                );

                $moveQty = min($item['quantity'], $fromLevel->quantity);
                if ($moveQty <= 0) {
                    continue;
                }

                $toLevel = StockLevel::firstOrCreate(
                    ['product_id' => $item['product_id'], 'variant_id' => $item['variant_id'] ?? null, 'branch_id' => $validated['to_branch_id']],
                    ['quantity' => 0],
                );

                $fromLevel->decrement('quantity', $moveQty);
                $toLevel->increment('quantity', $moveQty);

                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'branch_id' => $validated['from_branch_id'],
                    'related_branch_id' => $validated['to_branch_id'],
                    'type' => 'transfer_out',
                    'quantity_delta' => -$moveQty,
                    'reason' => 'transfer',
                    'notes' => $validated['notes'] ?? null,
                    'user_id' => $request->user()?->id,
                ]);

                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'branch_id' => $validated['to_branch_id'],
                    'related_branch_id' => $validated['from_branch_id'],
                    'type' => 'transfer_in',
                    'quantity_delta' => $moveQty,
                    'reason' => 'transfer',
                    'notes' => $validated['notes'] ?? null,
                    'user_id' => $request->user()?->id,
                ]);
            }
        });

        return back()->with('status', 'stock-transferred');
    }
}
