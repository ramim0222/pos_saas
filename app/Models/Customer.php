<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'customer_group_id',
        'name',
        'phone',
        'email',
        'address',
        'notes',
        'loyalty_points',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(CustomerGroup::class, 'customer_group_id');
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LoyaltyLedgerEntry::class);
    }

    public function getTotalOrdersAttribute(): int
    {
        return $this->sales()->count();
    }

    public function getTotalSpendAttribute(): float
    {
        return (float) $this->sales()->whereIn('status', ['completed', 'refunded'])->sum('total');
    }
}
