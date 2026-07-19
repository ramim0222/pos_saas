<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\StockLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()->with(['category', 'variants', 'images', 'stockLevels.branch']);

        if ($search = $request->string('search')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->integer('category')) {
            $query->where('category_id', $categoryId);
        }

        if ($brand = $request->string('brand')->trim()->toString()) {
            $query->where('brand', $brand);
        }

        $sort = $request->string('sort', 'name')->toString();
        $direction = $request->string('direction', 'asc')->toString() === 'desc' ? 'desc' : 'asc';
        if (in_array($sort, ['name', 'sku', 'price', 'created_at'], true)) {
            $query->orderBy($sort, $direction);
        }

        // Stock status depends on computed accessors (variant sums / branch_stocks
        // JSON), so it can't be filtered in SQL. Filter the full result set first,
        // then paginate the filtered collection, to keep page counts accurate.
        $stockStatus = $request->string('stock_status')->toString();
        $all = $query->get()->map(fn (Product $product) => $this->transform($product));

        if ($stockStatus) {
            $all = $all->filter(function ($product) use ($stockStatus) {
                if ($stockStatus === 'out') {
                    return $product['total_stock'] <= 0;
                }
                if ($stockStatus === 'low') {
                    return $product['total_stock'] > 0 && $product['is_low_stock'];
                }
                if ($stockStatus === 'in_stock') {
                    return $product['total_stock'] > 0 && ! $product['is_low_stock'];
                }

                return true;
            })->values();
        }

        $perPage = 12;
        $page = $request->integer('page', 1);
        $productsData = $all->slice(($page - 1) * $perPage, $perPage)->values();

        return Inertia::render('Admin/Products/Index', [
            'products' => $productsData,
            'pagination' => [
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($all->count() / $perPage)),
                'total' => $all->count(),
                'per_page' => $perPage,
            ],
            'categories' => ProductCategory::orderBy('name')->get(['id', 'name']),
            'brands' => Product::query()->whereNotNull('brand')->distinct()->orderBy('brand')->pluck('brand'),
            'filters' => $request->only(['search', 'category', 'brand', 'stock_status', 'sort', 'direction']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateProduct($request);

        DB::transaction(function () use ($validated, $request) {
            $product = Product::create($this->productAttributes($validated));

            $newVariantIds = $this->syncVariants($product, $validated['variants'] ?? []);
            $this->storeNewImages($product, $request->file('images', []));
            $this->syncStockLevels($product, $validated, $newVariantIds);
        });

        return back()->with('status', 'product-created');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validateProduct($request, $product->id);

        DB::transaction(function () use ($validated, $request, $product) {
            $product->update($this->productAttributes($validated));

            $newVariantIds = $this->syncVariants($product, $validated['variants'] ?? []);
            $this->syncExistingImages($product, $validated['existing_images'] ?? []);
            $this->storeNewImages($product, $request->file('images', []));
            $this->syncStockLevels($product, $validated, $newVariantIds);
        });

        return back()->with('status', 'product-updated');
    }

    public function destroy(Product $product): RedirectResponse
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        $product->delete();

        return back()->with('status', 'product-deleted');
    }

    public function duplicate(Product $product): RedirectResponse
    {
        DB::transaction(function () use ($product) {
            $copy = $product->replicate();
            $copy->name = $product->name.' (Copy)';
            $copy->sku = $product->sku.'-COPY-'.Str::upper(Str::random(4));
            $copy->save();

            $variantMap = [];
            foreach ($product->variants as $variant) {
                $newVariant = $copy->variants()->create([
                    'name' => $variant->name,
                    'sku' => $variant->sku.'-COPY-'.Str::upper(Str::random(4)),
                    'price' => $variant->price,
                    'stock' => $variant->stock,
                    'attributes' => $variant->attributes,
                ]);
                $variantMap[$variant->id] = $newVariant->id;
            }

            foreach ($product->stockLevels as $level) {
                StockLevel::create([
                    'product_id' => $copy->id,
                    'variant_id' => $level->variant_id ? ($variantMap[$level->variant_id] ?? null) : null,
                    'branch_id' => $level->branch_id,
                    'quantity' => $level->quantity,
                ]);
            }
        });

        return back()->with('status', 'product-duplicated');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $ids = $request->input('ids', []);
        $products = Product::whereIn('id', $ids)->with('images')->get();

        foreach ($products as $product) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->path);
            }
            $product->delete();
        }

        return back()->with('status', 'products-deleted');
    }

    public function bulkUpdateCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
            'category_id' => ['nullable', 'exists:product_categories,id'],
        ]);

        Product::whereIn('id', $validated['ids'])->update(['category_id' => $validated['category_id']]);

        return back()->with('status', 'products-updated');
    }

    public function export(Request $request): StreamedResponse
    {
        $products = Product::query()->with('category')->orderBy('name')->get();

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Name', 'SKU', 'Barcode', 'Category', 'Brand', 'Price', 'Stock', 'Status']);

            foreach ($products as $product) {
                fputcsv($handle, [
                    $product->name,
                    $product->sku,
                    $product->barcode,
                    $product->category?->name,
                    $product->brand,
                    $product->price,
                    $product->total_stock,
                    $product->status,
                ]);
            }

            fclose($handle);
        }, 'products-export.csv');
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.name' => ['required', 'string', 'max:255'],
            'rows.*.sku' => ['required', 'string', 'max:255'],
            'rows.*.price' => ['nullable', 'numeric'],
            'rows.*.brand' => ['nullable', 'string'],
            'rows.*.stock' => ['nullable', 'integer'],
        ]);

        $created = 0;
        foreach ($validated['rows'] as $row) {
            if (Product::where('sku', $row['sku'])->exists()) {
                continue;
            }

            Product::create([
                'name' => $row['name'],
                'sku' => $row['sku'],
                'brand' => $row['brand'] ?? null,
                'price' => $row['price'] ?? 0,
                'unit_type' => 'pcs',
                'tax_class' => 'standard',
                'status' => 'active',
                'branch_stocks' => isset($row['stock']) ? ['Gulshan' => (int) $row['stock']] : null,
                'reorder_point' => 10,
            ]);
            $created++;
        }

        return back()->with('status', "imported-{$created}");
    }

    private function validateProduct(Request $request, ?int $productId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:products,sku,'.($productId ?? 'NULL').',id'],
            'barcode' => ['nullable', 'string', 'max:255', 'unique:products,barcode,'.($productId ?? 'NULL').',id'],
            'category_id' => ['nullable', 'exists:product_categories,id'],
            'brand' => ['nullable', 'string', 'max:255'],
            'unit_type' => ['required', 'string', 'max:50'],
            'tax_class' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
            'price' => ['required', 'numeric', 'min:0'],
            'reorder_point' => ['nullable', 'integer', 'min:0'],
            'branch_stocks' => ['nullable', 'array'],
            'variants' => ['nullable', 'array'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.name' => ['required_with:variants', 'string', 'max:255'],
            'variants.*.sku' => ['required_with:variants', 'string', 'max:255'],
            'variants.*.price' => ['nullable', 'numeric'],
            'variants.*.stock' => ['nullable', 'integer'],
            'variants.*.attributes' => ['nullable', 'array'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*.id' => ['required', 'integer'],
            'existing_images.*.sort_order' => ['required', 'integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
        ]);
    }

    private function productAttributes(array $validated): array
    {
        return [
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'barcode' => $validated['barcode'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'brand' => $validated['brand'] ?? null,
            'unit_type' => $validated['unit_type'],
            'tax_class' => $validated['tax_class'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'price' => $validated['price'],
            'reorder_point' => $validated['reorder_point'] ?? 10,
            'branch_stocks' => empty($validated['variants']) ? ($validated['branch_stocks'] ?? null) : null,
        ];
    }

    /**
     * Create/update/remove variants to match the submitted list.
     * Returns the IDs of variants that were newly created (as opposed to
     * updated), so stock_levels initialization knows which ones need a
     * fresh even distribution vs. which already have branch-level history.
     */
    private function syncVariants(Product $product, array $variants): array
    {
        $keepIds = [];
        $newIds = [];

        foreach ($variants as $variantData) {
            $wasExisting = ! empty($variantData['id']);

            $variant = $product->variants()->updateOrCreate(
                ['id' => $variantData['id'] ?? null],
                [
                    'name' => $variantData['name'],
                    'sku' => $variantData['sku'],
                    'price' => $variantData['price'] ?? null,
                    'stock' => $variantData['stock'] ?? 0,
                    'attributes' => $variantData['attributes'] ?? null,
                ],
            );
            $keepIds[] = $variant->id;
            if (! $wasExisting) {
                $newIds[] = $variant->id;
            }
        }

        $product->variants()->whereNotIn('id', $keepIds)->delete();

        return $newIds;
    }

    /**
     * Keep stock_levels (the source of truth Inventory reads/writes) aligned
     * with what was submitted on the Products form.
     *
     * For non-variant products, the form has one input per branch, so we can
     * upsert those exact values without guessing. For variants, the form only
     * has a single total, so a brand new variant gets that total distributed
     * evenly across branches; an existing variant's per-branch split (set via
     * the Inventory page) is left alone so it isn't silently overwritten.
     */
    private function syncStockLevels(Product $product, array $validated, array $newVariantIds = []): void
    {
        $branches = Branch::pluck('id', 'name');
        if ($branches->isEmpty()) {
            return;
        }

        $hasVariants = ! empty($validated['variants']);

        if (! $hasVariants) {
            foreach ($branches as $name => $branchId) {
                $qty = (int) ($validated['branch_stocks'][$name] ?? 0);
                StockLevel::updateOrCreate(
                    ['product_id' => $product->id, 'variant_id' => null, 'branch_id' => $branchId],
                    ['quantity' => $qty],
                );
            }

            return;
        }

        if (empty($newVariantIds)) {
            return;
        }

        foreach ($product->variants()->whereIn('id', $newVariantIds)->get() as $variant) {
            $names = $branches->keys();
            $base = intdiv($variant->stock, $names->count());
            $remainder = $variant->stock % $names->count();

            foreach ($names->values() as $index => $name) {
                $qty = $base + ($index < $remainder ? 1 : 0);
                StockLevel::updateOrCreate(
                    ['product_id' => $product->id, 'variant_id' => $variant->id, 'branch_id' => $branches[$name]],
                    ['quantity' => $qty],
                );
            }
        }
    }

    private function syncExistingImages(Product $product, array $existingImages): void
    {
        $keepIds = collect($existingImages)->pluck('id')->all();

        $product->images()->whereNotIn('id', $keepIds)->get()->each(function (ProductImage $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        });

        foreach ($existingImages as $imageData) {
            $product->images()->where('id', $imageData['id'])->update(['sort_order' => $imageData['sort_order']]);
        }
    }

    private function storeNewImages(Product $product, array $files): void
    {
        $nextOrder = $product->images()->max('sort_order') + 1;

        foreach ($files as $file) {
            $path = $file->store('products', 'public');
            $product->images()->create([
                'path' => $path,
                'sort_order' => $nextOrder++,
            ]);
        }
    }

    private function transform(Product $product): array
    {
        $stockLevels = $product->relationLoaded('stockLevels') ? $product->stockLevels : collect();

        $branchStocks = $product->branch_stocks;
        if ($stockLevels->isNotEmpty()) {
            $branchStocks = $stockLevels
                ->whereNull('variant_id')
                ->filter(fn ($level) => $level->branch)
                ->groupBy(fn ($level) => $level->branch->name)
                ->map(fn ($levels) => (int) $levels->sum('quantity'))
                ->toArray();
        }

        $variantStockByVariantId = $stockLevels
            ->whereNotNull('variant_id')
            ->groupBy('variant_id')
            ->map(fn ($levels) => (int) $levels->sum('quantity'));

        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'barcode' => $product->barcode,
            'category' => $product->category?->only(['id', 'name']),
            'brand' => $product->brand,
            'unit_type' => $product->unit_type,
            'tax_class' => $product->tax_class,
            'description' => $product->description,
            'status' => $product->status,
            'price' => (float) $product->price,
            'reorder_point' => $product->reorder_point,
            'branch_stocks' => $branchStocks,
            'total_stock' => $product->total_stock,
            'is_low_stock' => $product->is_low_stock,
            'is_out_of_stock' => $product->is_out_of_stock,
            'variants' => $product->variants->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'sku' => $v->sku,
                'price' => $v->price !== null ? (float) $v->price : null,
                'stock' => $variantStockByVariantId->get($v->id, $v->stock),
                'attributes' => $v->attributes,
            ]),
            'images' => $product->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'sort_order' => $img->sort_order,
            ]),
        ];
    }
}
