<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BillingPayment;
use App\Models\ManualPaymentSubmission;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    private const PLANS = [
        'Starter' => ['monthly' => 999, 'yearly' => 833],
        'Pro' => ['monthly' => 2499, 'yearly' => 2083],
        'Enterprise' => ['monthly' => 6200, 'yearly' => 5583],
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();
        $subscription = $this->currentSubscription($user);

        $payments = BillingPayment::where('user_id', $user->id)
            ->orderByDesc('period_start')
            ->get()
            ->map(fn (BillingPayment $p) => [
                'id' => $p->id,
                'date' => $p->paid_at?->format('d M Y') ?? $p->created_at->format('d M Y'),
                'plan' => $p->plan,
                'amount' => (float) $p->amount,
                'period' => $p->period_start->format('d M').' – '.$p->period_end->format('d M Y'),
                'method' => $p->method,
                'transaction_id' => $p->transaction_id,
                'status' => $p->status,
            ]);

        $manualSubmissions = ManualPaymentSubmission::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ManualPaymentSubmission $m) => [
                'id' => $m->id,
                'transaction_id' => $m->transaction_id,
                'amount' => (float) $m->amount,
                'status' => $m->status,
                'submitted_at' => $m->created_at->format('d M Y, g:i A'),
            ]);

        return Inertia::render('Admin/Billing/Index', [
            'subscription' => $this->transformSubscription($subscription),
            'plans' => collect(self::PLANS)->map(fn ($prices, $name) => [
                'name' => $name,
                'monthly' => $prices['monthly'],
                'yearly' => $prices['yearly'],
            ])->values(),
            'payments' => $payments,
            'manualSubmissions' => $manualSubmissions,
        ]);
    }

    public function payNow(Request $request): RedirectResponse
    {
        $user = $request->user();
        $subscription = $this->currentSubscription($user);

        $start = Carbon::now();
        $end = $subscription->billing_cycle === 'yearly' ? $start->copy()->addYear() : $start->copy()->addDays(30);

        BillingPayment::create([
            'user_id' => $user->id,
            'plan' => $subscription->plan,
            'amount' => $subscription->amount,
            'period_start' => $start,
            'period_end' => $end,
            'method' => 'bkash',
            'transaction_id' => 'BK'.strtoupper(Str::random(10)),
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $subscription->update([
            'status' => 'active',
            'current_period_start' => $start,
            'current_period_end' => $end,
            'trial_ends_at' => null,
            'grace_ends_at' => null,
        ]);

        return back()->with('status', 'payment-successful');
    }

    public function changePlan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => ['required', 'in:Starter,Pro,Enterprise'],
            'billing_cycle' => ['required', 'in:monthly,yearly'],
        ]);

        $subscription = $this->currentSubscription($request->user());
        $amount = self::PLANS[$validated['plan']][$validated['billing_cycle']];

        $subscription->update([
            'plan' => $validated['plan'],
            'billing_cycle' => $validated['billing_cycle'],
            'amount' => $amount,
        ]);

        return back()->with('status', 'plan-changed');
    }

    public function submitManualPayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'transaction_id' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string', 'max:500'],
            'screenshot' => ['nullable', 'image', 'max:4096'],
        ]);

        $path = null;
        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('manual-payments', 'public');
        }

        ManualPaymentSubmission::create([
            'user_id' => $request->user()->id,
            'transaction_id' => $validated['transaction_id'],
            'amount' => $validated['amount'],
            'notes' => $validated['notes'] ?? null,
            'screenshot_path' => $path,
            'status' => 'pending',
        ]);

        return back()->with('status', 'manual-payment-submitted');
    }

    public function updateReminders(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reminder_email' => ['required', 'boolean'],
            'reminder_sms' => ['required', 'boolean'],
            'reminder_days_before' => ['required', 'integer', 'min:1', 'max:14'],
        ]);

        $this->currentSubscription($request->user())->update($validated);

        return back()->with('status', 'reminders-updated');
    }

    private function currentSubscription($user): Subscription
    {
        return Subscription::firstOrCreate(
            ['user_id' => $user->id],
            [
                'plan' => 'Starter',
                'billing_cycle' => 'monthly',
                'amount' => self::PLANS['Starter']['monthly'],
                'status' => 'trial',
                'current_period_start' => now(),
                'current_period_end' => now()->addDays(14),
                'trial_ends_at' => now()->addDays(14),
            ],
        );
    }

    private function transformSubscription(Subscription $s): array
    {
        $now = Carbon::now();
        $daysLeft = null;

        if ($s->status === 'trial' && $s->trial_ends_at) {
            $daysLeft = max(0, $now->diffInDays($s->trial_ends_at, false));
        } elseif ($s->status === 'grace' && $s->grace_ends_at) {
            $daysLeft = max(0, $now->diffInDays($s->grace_ends_at, false));
        }

        return [
            'plan' => $s->plan,
            'billing_cycle' => $s->billing_cycle,
            'amount' => (float) $s->amount,
            'status' => $s->status,
            'days_left' => $daysLeft,
            'current_period_start' => $s->current_period_start->format('d M Y'),
            'current_period_end' => $s->current_period_end->format('d M Y'),
            'reminder_email' => $s->reminder_email,
            'reminder_sms' => $s->reminder_sms,
            'reminder_days_before' => $s->reminder_days_before,
        ];
    }
}
