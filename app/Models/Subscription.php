<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan',
        'billing_cycle',
        'amount',
        'status',
        'current_period_start',
        'current_period_end',
        'trial_ends_at',
        'grace_ends_at',
        'reminder_email',
        'reminder_sms',
        'reminder_days_before',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'current_period_start' => 'date',
            'current_period_end' => 'date',
            'trial_ends_at' => 'date',
            'grace_ends_at' => 'date',
            'reminder_email' => 'boolean',
            'reminder_sms' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
