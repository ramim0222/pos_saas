<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\StoreSetting;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = $this->currentSettings($request);
        $subscription = Subscription::where('user_id', $request->user()->id)->first();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $this->transform($settings),
            'notifications' => [
                'notify_low_stock' => $settings->notify_low_stock,
                'notify_daily_sales_email' => $settings->notify_daily_sales_email,
                'reminder_email' => $subscription?->reminder_email ?? true,
                'reminder_sms' => $subscription?->reminder_sms ?? false,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'store_name' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:150'],
            'business_hours' => ['required', 'array'],
            'business_hours.*.day' => ['required', 'string'],
            'business_hours.*.open' => ['nullable', 'string'],
            'business_hours.*.close' => ['nullable', 'string'],
            'business_hours.*.closed' => ['required', 'boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $settings = $this->currentSettings($request);

        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('public')->delete($settings->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('store-logos', 'public');
        }
        unset($validated['logo']);

        // forceFormData (needed for the logo upload) serializes booleans as
        // the strings "0"/"1", which are both truthy in JS — normalize
        // before persisting so the checkbox state round-trips correctly.
        $validated['business_hours'] = collect($validated['business_hours'])
            ->map(fn ($day) => [...$day, 'closed' => filter_var($day['closed'], FILTER_VALIDATE_BOOLEAN)])
            ->all();

        $settings->update($validated);

        return back()->with('status', 'profile-updated');
    }

    public function updateReceipt(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'receipt_logo_enabled' => ['required', 'boolean'],
            'receipt_header' => ['nullable', 'string', 'max:255'],
            'receipt_footer' => ['nullable', 'string', 'max:1000'],
        ]);

        $this->currentSettings($request)->update($validated);

        return back()->with('status', 'receipt-updated');
    }

    public function updateTax(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tax_inclusive' => ['required', 'boolean'],
            'tax_classes' => ['required', 'array', 'min:1'],
            'tax_classes.*.name' => ['required', 'string'],
            'tax_classes.*.label' => ['required', 'string', 'max:60'],
            'tax_classes.*.rate' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $this->currentSettings($request)->update($validated);

        return back()->with('status', 'tax-updated');
    }

    public function updateLocalization(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'currency_symbol' => ['required', 'string', 'max:5'],
            'currency_code' => ['required', 'string', 'max:5'],
            'date_format' => ['required', 'string', 'max:20'],
            'timezone' => ['required', 'string', 'max:60'],
        ]);

        $this->currentSettings($request)->update($validated);

        return back()->with('status', 'localization-updated');
    }

    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'notify_low_stock' => ['required', 'boolean'],
            'notify_daily_sales_email' => ['required', 'boolean'],
            'reminder_email' => ['required', 'boolean'],
            'reminder_sms' => ['required', 'boolean'],
        ]);

        $this->currentSettings($request)->update([
            'notify_low_stock' => $validated['notify_low_stock'],
            'notify_daily_sales_email' => $validated['notify_daily_sales_email'],
        ]);

        Subscription::where('user_id', $request->user()->id)->first()?->update([
            'reminder_email' => $validated['reminder_email'],
            'reminder_sms' => $validated['reminder_sms'],
        ]);

        return back()->with('status', 'notifications-updated');
    }

    public function exportData(Request $request): StreamedResponse
    {
        $data = [
            'exported_at' => now()->toIso8601String(),
            'store' => $this->currentSettings($request)->store_name,
            'products' => Product::count(),
            'customers' => Customer::count(),
            'sales' => Sale::count(),
            'purchase_orders' => PurchaseOrder::count(),
        ];

        $json = json_encode($data, JSON_PRETTY_PRINT);

        return response()->streamDownload(function () use ($json) {
            echo $json;
        }, 'dokan-store-export.json', ['Content-Type' => 'application/json']);
    }

    private function currentSettings(Request $request): StoreSetting
    {
        return StoreSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'store_name' => $request->user()->store_name ?? $request->user()->name."'s Store",
                'business_hours' => $this->defaultBusinessHours(),
                'tax_classes' => $this->defaultTaxClasses(),
            ],
        );
    }

    private function defaultBusinessHours(): array
    {
        return collect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            ->map(fn ($day) => ['day' => $day, 'open' => '09:00', 'close' => '21:00', 'closed' => false])
            ->all();
    }

    private function defaultTaxClasses(): array
    {
        return [
            ['name' => 'standard', 'label' => 'Standard', 'rate' => 5],
            ['name' => 'reduced', 'label' => 'Reduced', 'rate' => 2.5],
            ['name' => 'zero', 'label' => 'Zero-rated', 'rate' => 0],
        ];
    }

    private function transform(StoreSetting $s): array
    {
        return [
            'store_name' => $s->store_name,
            'logo_url' => $s->logo_path ? Storage::disk('public')->url($s->logo_path) : null,
            'address' => $s->address,
            'phone' => $s->phone,
            'email' => $s->email,
            'business_hours' => $s->business_hours ?? $this->defaultBusinessHours(),
            'receipt_logo_enabled' => $s->receipt_logo_enabled,
            'receipt_header' => $s->receipt_header,
            'receipt_footer' => $s->receipt_footer,
            'tax_inclusive' => $s->tax_inclusive,
            'tax_classes' => $s->tax_classes ?? $this->defaultTaxClasses(),
            'currency_symbol' => $s->currency_symbol,
            'currency_code' => $s->currency_code,
            'date_format' => $s->date_format,
            'timezone' => $s->timezone,
            'last_backup_at' => $s->last_backup_at?->format('d M Y, g:i A'),
        ];
    }
}
