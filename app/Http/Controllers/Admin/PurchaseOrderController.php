<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\StockLevel;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $branches = Branch::orderBy('name')->get(['id', 'name']);

        $suppliers = Supplier::withCount('purchaseOrders')->orderBy('name')->get()->map(fn (Supplier $s) => [
            'id' => $s->id,
            'name' => $s->name,
            'contact_person' => $s->contact_person,
            'phone' => $s->phone,
            'email' => $s->email,
            'address' => $s->address,
            'payment_terms' => $s->payment_terms,
            'notes' => $s->notes,
            'is_active' => $s->is_active,
            'total_pos' => $s->purchase_orders_count,
            'total_spend' => round($s->total_spend, 2),
            'outstanding_balance' => round($s->outstanding_balance, 2),
        ]);

        $products = Product::with('variants')->orderBy('name')->get()->map(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'sku' => $p->sku,
            'price' => (float) $p->price,
            'variants' => $p->variants->map(fn ($v) => ['id' => $v->id, 'name' => $v->name, 'sku' => $v->sku]),
        ]);

        $purchaseOrders = PurchaseOrder::with(['supplier:id,name', 'branch:id,name', 'items.product:id,name,sku', 'items.variant:id,name'])
            ->latest('order_date')
            ->latest('id')
            ->get()
            ->map(fn (PurchaseOrder $po) => $this->transform($po));

        $payments = SupplierPayment::with('purchaseOrder:id,po_number')
            ->orderByDesc('paid_at')
            ->get()
            ->map(fn (SupplierPayment $payment) => [
                'id' => $payment->id,
                'supplier_id' => $payment->supplier_id,
                'purchase_order_id' => $payment->purchase_order_id,
                'po_number' => $payment->purchaseOrder?->po_number,
                'amount' => (float) $payment->amount,
                'method' => $payment->method,
                'notes' => $payment->notes,
                'paid_at' => $payment->paid_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Purchases/Index', [
            'branches' => $branches,
            'suppliers' => $suppliers,
            'products' => $products,
            'purchaseOrders' => $purchaseOrders,
            'payments' => $payments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePurchaseOrder($request);

        DB::transaction(function () use ($validated) {
            $po = PurchaseOrder::create([
                'po_number' => $this->nextPoNumber(),
                'supplier_id' => $validated['supplier_id'],
                'branch_id' => $validated['branch_id'],
                'created_by' => request()->user()?->id,
                'status' => $validated['status'],
                'order_date' => now(),
                'expected_delivery' => $validated['expected_delivery'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'total_amount' => 0,
            ]);

            $this->syncItems($po, $validated['items']);
        });

        return back()->with('status', 'purchase-order-created');
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status !== 'draft') {
            throw ValidationException::withMessages(['status' => 'Only draft purchase orders can be edited.']);
        }

        $validated = $this->validatePurchaseOrder($request);

        DB::transaction(function () use ($validated, $purchaseOrder) {
            $purchaseOrder->update([
                'supplier_id' => $validated['supplier_id'],
                'branch_id' => $validated['branch_id'],
                'status' => $validated['status'],
                'expected_delivery' => $validated['expected_delivery'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            $purchaseOrder->items()->delete();
            $this->syncItems($purchaseOrder, $validated['items']);
        });

        return back()->with('status', 'purchase-order-updated');
    }

    public function destroy(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status !== 'draft') {
            throw ValidationException::withMessages(['status' => 'Only draft purchase orders can be deleted.']);
        }

        $purchaseOrder->delete();

        return back()->with('status', 'purchase-order-deleted');
    }

    public function send(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if ($purchaseOrder->status !== 'draft') {
            throw ValidationException::withMessages(['status' => 'Only draft purchase orders can be sent.']);
        }

        $purchaseOrder->update(['status' => 'sent']);

        return back()->with('status', 'purchase-order-sent');
    }

    public function cancel(PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if (! in_array($purchaseOrder->status, ['draft', 'sent'], true)) {
            throw ValidationException::withMessages(['status' => 'This purchase order can no longer be cancelled.']);
        }

        $purchaseOrder->update(['status' => 'cancelled']);

        return back()->with('status', 'purchase-order-cancelled');
    }

    public function receive(Request $request, PurchaseOrder $purchaseOrder): RedirectResponse
    {
        if (! in_array($purchaseOrder->status, ['sent', 'partially_received'], true)) {
            throw ValidationException::withMessages(['status' => 'This purchase order is not awaiting receiving.']);
        }

        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_id' => ['required', 'exists:purchase_order_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $purchaseOrder) {
            foreach ($validated['items'] as $entry) {
                $item = PurchaseOrderItem::where('purchase_order_id', $purchaseOrder->id)->findOrFail($entry['item_id']);

                $remaining = $item->quantity - $item->received_quantity;
                $qty = min($entry['quantity'], $remaining);

                if ($qty <= 0) {
                    continue;
                }

                $item->increment('received_quantity', $qty);

                $level = StockLevel::firstOrCreate(
                    ['product_id' => $item->product_id, 'variant_id' => $item->variant_id, 'branch_id' => $purchaseOrder->branch_id],
                    ['quantity' => 0],
                );
                $level->increment('quantity', $qty);

                StockMovement::create([
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'branch_id' => $purchaseOrder->branch_id,
                    'type' => 'purchase_receipt',
                    'quantity_delta' => $qty,
                    'reason' => 'purchase',
                    'notes' => "Received against {$purchaseOrder->po_number}",
                    'user_id' => request()->user()?->id,
                ]);
            }

            $purchaseOrder->refresh();
            $ordered = $purchaseOrder->items->sum('quantity');
            $received = $purchaseOrder->items->sum('received_quantity');

            $purchaseOrder->update([
                'status' => $received >= $ordered ? 'received' : ($received > 0 ? 'partially_received' : $purchaseOrder->status),
            ]);
        });

        return back()->with('status', 'purchase-order-received');
    }

    private function validatePurchaseOrder(Request $request): array
    {
        return $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'branch_id' => ['required', 'exists:branches,id'],
            'status' => ['required', 'in:draft,sent'],
            'expected_delivery' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
        ]);
    }

    private function syncItems(PurchaseOrder $po, array $items): void
    {
        $total = 0;

        foreach ($items as $item) {
            PurchaseOrderItem::create([
                'purchase_order_id' => $po->id,
                'product_id' => $item['product_id'],
                'variant_id' => $item['variant_id'] ?? null,
                'quantity' => $item['quantity'],
                'unit_cost' => $item['unit_cost'],
                'received_quantity' => 0,
            ]);

            $total += $item['quantity'] * $item['unit_cost'];
        }

        $po->update(['total_amount' => round($total, 2)]);
    }

    private function nextPoNumber(): string
    {
        do {
            $candidate = 'PO-'.(1030 + PurchaseOrder::count() + random_int(1, 999));
        } while (PurchaseOrder::where('po_number', $candidate)->exists());

        return $candidate;
    }

    private function transform(PurchaseOrder $po): array
    {
        return [
            'id' => $po->id,
            'po_number' => $po->po_number,
            'supplier_id' => $po->supplier_id,
            'supplier' => $po->supplier?->name,
            'branch_id' => $po->branch_id,
            'branch' => $po->branch?->name,
            'status' => $po->status,
            'order_date' => $po->order_date->format('d M Y'),
            'expected_delivery' => $po->expected_delivery?->format('d M Y'),
            'expected_delivery_raw' => $po->expected_delivery?->format('Y-m-d'),
            'total_amount' => (float) $po->total_amount,
            'notes' => $po->notes,
            'receiving_progress' => $po->receiving_progress,
            'items' => $po->items->map(fn (PurchaseOrderItem $item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product' => $item->product?->name,
                'sku' => $item->product?->sku,
                'variant_id' => $item->variant_id,
                'variant' => $item->variant?->name,
                'quantity' => $item->quantity,
                'unit_cost' => (float) $item->unit_cost,
                'received_quantity' => $item->received_quantity,
                'line_total' => round($item->quantity * (float) $item->unit_cost, 2),
            ]),
        ];
    }
}
