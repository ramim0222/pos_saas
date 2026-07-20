<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Models\LoyaltyLedgerEntry;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $query = Customer::with(['group', 'sales', 'ledgerEntries' => fn ($q) => $q->orderByDesc('created_at')]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderBy('name')->get()->map(fn (Customer $customer) => $this->transform($customer));

        $groups = CustomerGroup::withCount('customers')->orderBy('discount_percent')->get()->map(fn (CustomerGroup $g) => [
            'id' => $g->id,
            'name' => $g->name,
            'discount_percent' => (float) $g->discount_percent,
            'description' => $g->description,
            'customers_count' => $g->customers_count,
        ]);

        return Inertia::render('Admin/Customers/Index', [
            'search' => $search,
            'customers' => $customers,
            'groups' => $groups,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCustomer($request);

        Customer::create($validated);

        return back()->with('status', 'customer-created');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $this->validateCustomer($request);

        $customer->update($validated);

        return back()->with('status', 'customer-updated');
    }

    public function adjustPoints(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:earned,redeemed,adjusted'],
            'points' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $delta = $validated['type'] === 'redeemed' ? -$validated['points'] : $validated['points'];

        LoyaltyLedgerEntry::create([
            'customer_id' => $customer->id,
            'type' => $validated['type'],
            'points' => $delta,
            'reason' => $validated['reason'],
            'created_by' => $request->user()?->id,
        ]);

        $customer->update(['loyalty_points' => max(0, $customer->loyalty_points + $delta)]);

        return back()->with('status', 'points-adjusted');
    }

    private function validateCustomer(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'customer_group_id' => ['nullable', 'exists:customer_groups,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    private function transform(Customer $customer): array
    {
        $lastSale = $customer->sales->sortByDesc('sold_at')->first();

        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'email' => $customer->email,
            'address' => $customer->address,
            'notes' => $customer->notes,
            'group' => $customer->group ? ['id' => $customer->group->id, 'name' => $customer->group->name, 'discount_percent' => (float) $customer->group->discount_percent] : null,
            'total_orders' => $customer->sales->count(),
            'total_spend' => (float) $customer->sales->whereIn('status', ['completed', 'refunded'])->sum('total'),
            'loyalty_points' => $customer->loyalty_points,
            'last_purchase_at' => $lastSale?->sold_at?->format('d M Y'),
            'purchase_history' => $customer->sales->sortByDesc('sold_at')->values()->map(fn (Sale $sale) => [
                'id' => $sale->id,
                'sale_number' => $sale->sale_number,
                'sold_at' => $sale->sold_at->format('d M Y'),
                'total' => (float) $sale->total,
                'status' => $sale->status,
            ]),
            'ledger' => $customer->ledgerEntries->map(fn (LoyaltyLedgerEntry $entry) => [
                'id' => $entry->id,
                'type' => $entry->type,
                'points' => $entry->points,
                'reason' => $entry->reason,
                'created_at' => $entry->created_at->format('d M Y, g:i A'),
            ]),
        ];
    }
}
