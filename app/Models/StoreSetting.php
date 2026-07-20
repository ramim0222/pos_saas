<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreSetting extends Model
{
    protected $fillable = [
        'user_id',
        'store_name',
        'logo_path',
        'address',
        'phone',
        'email',
        'business_hours',
        'receipt_logo_enabled',
        'receipt_header',
        'receipt_footer',
        'tax_inclusive',
        'tax_classes',
        'currency_symbol',
        'currency_code',
        'date_format',
        'timezone',
        'last_backup_at',
        'notify_low_stock',
        'notify_daily_sales_email',
    ];

    protected function casts(): array
    {
        return [
            'business_hours' => 'array',
            'tax_classes' => 'array',
            'receipt_logo_enabled' => 'boolean',
            'tax_inclusive' => 'boolean',
            'notify_low_stock' => 'boolean',
            'notify_daily_sales_email' => 'boolean',
            'last_backup_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
