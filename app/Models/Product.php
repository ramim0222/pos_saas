<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'category_id',
        'brand',
        'unit_type',
        'tax_class',
        'description',
        'status',
        'price',
        'branch_stocks',
        'reorder_point',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'branch_stocks' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function stockLevels(): HasMany
    {
        return $this->hasMany(StockLevel::class);
    }

    public function batches(): HasMany
    {
        return $this->hasMany(ProductBatch::class);
    }

    public function getTotalStockAttribute(): int
    {
        if ($this->relationLoaded('stockLevels') && $this->stockLevels->isNotEmpty()) {
            return (int) $this->stockLevels->sum('quantity');
        }

        if ($this->relationLoaded('variants') && $this->variants->isNotEmpty()) {
            return (int) $this->variants->sum('stock');
        }

        return (int) collect($this->branch_stocks ?? [])->sum();
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->total_stock > 0 && $this->total_stock <= $this->reorder_point;
    }

    public function getIsOutOfStockAttribute(): bool
    {
        return $this->total_stock <= 0;
    }
}
