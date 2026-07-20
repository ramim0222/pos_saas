<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockLevel;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->string('from')->toString() ?: Carbon::now()->subDays(29)->toDateString();
        $to = $request->string('to')->toString() ?: Carbon::now()->toDateString();
        $branchId = $request->string('branch')->toString() ?: 'all';
        $cashierId = $request->string('cashier')->toString() ?: 'all';
        $method = $request->string('method')->toString() ?: 'all';
        $search = $request->string('search')->trim()->toString();

        $query = Sale::query()
            ->with(['branch:id,name', 'cashier:id,name', 'customer', 'payments', 'items.product', 'items.variant'])
            ->whereBetween('sold_at', [Carbon::parse($from)->startOfDay(), Carbon::parse($to)->endOfDay()]);

        if ($branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }
        if ($cashierId !== 'all') {
            $query->where('cashier_id', $cashierId);
        }
        if ($method !== 'all') {
            $query->whereHas('payments', fn ($q) => $q->where('method', $method));
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('sale_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        $sales = $query->orderByDesc('sold_at')->get();

        $summary = [
            'total_sales' => (float) $sales->whereIn('status', ['completed'])->sum('total'),
            'total_transactions' => $sales->count(),
            'average_order_value' => $sales->where('status', 'completed')->count() > 0
                ? round($sales->where('status', 'completed')->avg('total'), 2)
                : 0,
            'total_refunds' => (float) $sales->where('status', 'refunded')->sum('total'),
        ];

        $rows = $sales->map(fn (Sale $sale) => $this->transform($sale));

        return Inertia::render('Admin/Sales/Index', [
            'filters' => ['from' => $from, 'to' => $to, 'branch' => $branchId, 'cashier' => $cashierId, 'method' => $method, 'search' => $search],
            'branches' => Branch::orderBy('name')->get(['id', 'name']),
            'cashiers' => User::orderBy('name')->get(['id', 'name']),
            'summary' => $summary,
            'sales' => $rows,
        ]);
    }

    public function refund(Request $request, Sale $sale): RedirectResponse
    {
        if ($sale->status !== 'completed') {
            throw ValidationException::withMessages(['status' => 'Only completed sales can be refunded.']);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($sale, $validated) {
            $this->restoreStock($sale, 'sale_refund', $validated['reason']);

            $sale->update([
                'status' => 'refunded',
                'refund_reason' => $validated['reason'],
                'refunded_at' => now(),
            ]);
        });

        return back()->with('status', 'sale-refunded');
    }

    public function void(Request $request, Sale $sale): RedirectResponse
    {
        if ($sale->status !== 'completed') {
            throw ValidationException::withMessages(['status' => 'Only completed sales can be voided.']);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($sale, $validated) {
            $this->restoreStock($sale, 'sale_void', $validated['reason']);

            $sale->update([
                'status' => 'voided',
                'void_reason' => $validated['reason'],
                'voided_at' => now(),
            ]);
        });

        return back()->with('status', 'sale-voided');
    }

    public function export(Request $request): StreamedResponse
    {
        $from = $request->string('from')->toString() ?: Carbon::now()->subDays(29)->toDateString();
        $to = $request->string('to')->toString() ?: Carbon::now()->toDateString();

        $sales = Sale::with(['branch', 'cashier', 'customer'])
            ->whereBetween('sold_at', [Carbon::parse($from)->startOfDay(), Carbon::parse($to)->endOfDay()])
            ->orderByDesc('sold_at')
            ->get();

        return response()->streamDownload(function () use ($sales) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Sale #', 'Date', 'Branch', 'Cashier', 'Customer', 'Total', 'Status']);

            foreach ($sales as $sale) {
                fputcsv($handle, [
                    $sale->sale_number,
                    $sale->sold_at->format('Y-m-d H:i'),
                    $sale->branch?->name,
                    $sale->cashier?->name,
                    $sale->customer?->name,
                    $sale->total,
                    $sale->status,
                ]);
            }

            fclose($handle);
        }, 'sales-export.csv');
    }

    private function restoreStock(Sale $sale, string $movementType, string $reason): void
    {
        foreach ($sale->items as $item) {
            $level = StockLevel::firstOrCreate(
                ['product_id' => $item->product_id, 'variant_id' => $item->variant_id, 'branch_id' => $sale->branch_id],
                ['quantity' => 0],
            );
            $level->increment('quantity', $item->quantity);

            StockMovement::create([
                'product_id' => $item->product_id,
                'variant_id' => $item->variant_id,
                'branch_id' => $sale->branch_id,
                'type' => $movementType,
                'quantity_delta' => $item->quantity,
                'reason' => $reason,
                'notes' => ($movementType === 'sale_void' ? 'Void' : 'Refund')." for {$sale->sale_number}",
                'user_id' => request()->user()?->id,
            ]);
        }
    }

    private function transform(Sale $sale): array
    {
        return [
            'id' => $sale->id,
            'sale_number' => $sale->sale_number,
            'sold_at' => $sale->sold_at->format('d M Y, g:i A'),
            'branch' => $sale->branch?->name,
            'cashier' => $sale->cashier?->name,
            'customer' => $sale->customer ? [
                'name' => $sale->customer->name,
                'phone' => $sale->customer->phone,
                'email' => $sale->customer->email,
            ] : null,
            'items_count' => (int) $sale->items->sum('quantity'),
            'subtotal' => (float) $sale->subtotal,
            'discount_total' => (float) $sale->discount_total,
            'tax_total' => (float) $sale->tax_total,
            'total' => (float) $sale->total,
            'status' => $sale->status,
            'void_reason' => $sale->void_reason,
            'refund_reason' => $sale->refund_reason,
            'voided_at' => $sale->voided_at?->format('d M Y, g:i A'),
            'refunded_at' => $sale->refunded_at?->format('d M Y, g:i A'),
            'payment_methods' => $sale->payments->pluck('method')->unique()->values(),
            'items' => $sale->items->map(fn (SaleItem $item) => [
                'id' => $item->id,
                'product' => $item->product?->name,
                'variant' => $item->variant?->name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'discount' => (float) $item->discount,
                'tax' => (float) $item->tax,
                'line_total' => (float) $item->line_total,
            ]),
            'payments' => $sale->payments->map(fn ($p) => [
                'method' => $p->method,
                'amount' => (float) $p->amount,
            ]),
        ];
    }
}
