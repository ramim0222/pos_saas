<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = [
        'name',
        'contact_person',
        'phone',
        'email',
        'address',
        'payment_terms',
        'notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SupplierPayment::class);
    }

    public function getTotalSpendAttribute(): float
    {
        return (float) $this->purchaseOrders()
            ->whereIn('status', ['sent', 'partially_received', 'received'])
            ->sum('total_amount');
    }

    public function getOutstandingBalanceAttribute(): float
    {
        return max(0, $this->total_spend - (float) $this->payments()->sum('amount'));
    }
}
