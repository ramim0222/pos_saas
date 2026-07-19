<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateSupplier($request);

        Supplier::create($validated + ['is_active' => true]);

        return back()->with('status', 'supplier-created');
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $validated = $this->validateSupplier($request);

        $supplier->update($validated);

        return back()->with('status', 'supplier-updated');
    }

    public function deactivate(Supplier $supplier): RedirectResponse
    {
        $supplier->update(['is_active' => ! $supplier->is_active]);

        return back()->with('status', 'supplier-toggled');
    }

    public function storePayment(Request $request, Supplier $supplier): RedirectResponse
    {
        $validated = $request->validate([
            'purchase_order_id' => ['nullable', 'exists:purchase_orders,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['nullable', 'string', 'max:60'],
            'notes' => ['nullable', 'string', 'max:500'],
            'paid_at' => ['required', 'date'],
        ]);

        SupplierPayment::create($validated + ['supplier_id' => $supplier->id]);

        return back()->with('status', 'payment-recorded');
    }

    private function validateSupplier(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'contact_person' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'payment_terms' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);
    }
}
