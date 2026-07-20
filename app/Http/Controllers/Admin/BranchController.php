<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Sale;
use App\Models\StockLevel;
use App\Models\Subscription;
use App\Models\TransferRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    private const PLAN_LIMITS = [
        'Starter' => 1,
        'Pro' => 5,
        'Enterprise' => null,
    ];

    public function index(Request $request): Response
    {
        $branches = Branch::with(['manager', 'staff'])
            ->withCount('staff')
            ->orderBy('name')
            ->get()
            ->map(fn (Branch $b) => $this->transform($b));

        $subscription = Subscription::first();
        $plan = $subscription?->plan ?? 'Starter';
        $limit = self::PLAN_LIMITS[$plan] ?? null;

        $managers = User::whereIn('role', ['owner', 'manager'])
            ->where('staff_status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        $transferRequests = TransferRequest::with(['product:id,name,sku', 'fromBranch:id,name', 'toBranch:id,name', 'requester:id,name'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (TransferRequest $t) => [
                'id' => $t->id,
                'product' => $t->product?->name,
                'sku' => $t->product?->sku,
                'quantity' => $t->quantity,
                'from_branch' => $t->fromBranch?->name,
                'to_branch' => $t->toBranch?->name,
                'requested_by' => $t->requester?->name ?? 'System',
                'notes' => $t->notes,
                'created_at' => $t->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
            'usage' => ['used' => $branches->count(), 'limit' => $limit, 'plan' => $plan],
            'managers' => $managers,
            'transferRequests' => $transferRequests,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateBranch($request);

        $subscription = Subscription::first();
        $plan = $subscription?->plan ?? 'Starter';
        $limit = self::PLAN_LIMITS[$plan] ?? null;
        $used = Branch::count();

        if ($limit !== null && $used >= $limit) {
            throw ValidationException::withMessages(['name' => "You've reached your {$plan} plan's branch limit ({$limit}). Upgrade to add more branches."]);
        }

        Branch::create($validated + ['is_active' => true]);

        return back()->with('status', 'branch-created');
    }

    public function update(Request $request, Branch $branch): RedirectResponse
    {
        $branch->update($this->validateBranch($request));

        return back()->with('status', 'branch-updated');
    }

    public function deactivate(Branch $branch): RedirectResponse
    {
        $branch->update(['is_active' => false]);

        return back()->with('status', 'branch-deactivated');
    }

    public function reactivate(Branch $branch): RedirectResponse
    {
        $branch->update(['is_active' => true]);

        return back()->with('status', 'branch-reactivated');
    }

    public function approveTransfer(Request $request, TransferRequest $transferRequest): RedirectResponse
    {
        if ($transferRequest->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'This request has already been decided.']);
        }

        $fromLevel = StockLevel::firstOrCreate(
            ['product_id' => $transferRequest->product_id, 'variant_id' => $transferRequest->variant_id, 'branch_id' => $transferRequest->from_branch_id],
            ['quantity' => 0],
        );

        $moveQty = min($transferRequest->quantity, $fromLevel->quantity);

        if ($moveQty > 0) {
            $toLevel = StockLevel::firstOrCreate(
                ['product_id' => $transferRequest->product_id, 'variant_id' => $transferRequest->variant_id, 'branch_id' => $transferRequest->to_branch_id],
                ['quantity' => 0],
            );

            $fromLevel->decrement('quantity', $moveQty);
            $toLevel->increment('quantity', $moveQty);

            \App\Models\StockMovement::create([
                'product_id' => $transferRequest->product_id,
                'variant_id' => $transferRequest->variant_id,
                'branch_id' => $transferRequest->from_branch_id,
                'related_branch_id' => $transferRequest->to_branch_id,
                'type' => 'transfer_out',
                'quantity_delta' => -$moveQty,
                'reason' => 'transfer_request',
                'notes' => "Approved transfer request #{$transferRequest->id}",
                'user_id' => $request->user()?->id,
            ]);

            \App\Models\StockMovement::create([
                'product_id' => $transferRequest->product_id,
                'variant_id' => $transferRequest->variant_id,
                'branch_id' => $transferRequest->to_branch_id,
                'related_branch_id' => $transferRequest->from_branch_id,
                'type' => 'transfer_in',
                'quantity_delta' => $moveQty,
                'reason' => 'transfer_request',
                'notes' => "Approved transfer request #{$transferRequest->id}",
                'user_id' => $request->user()?->id,
            ]);
        }

        $transferRequest->update([
            'status' => 'approved',
            'decided_by' => $request->user()?->id,
            'decided_at' => now(),
        ]);

        return back()->with('status', 'transfer-approved');
    }

    public function rejectTransfer(Request $request, TransferRequest $transferRequest): RedirectResponse
    {
        if ($transferRequest->status !== 'pending') {
            throw ValidationException::withMessages(['status' => 'This request has already been decided.']);
        }

        $transferRequest->update([
            'status' => 'rejected',
            'decided_by' => $request->user()?->id,
            'decided_at' => now(),
        ]);

        return back()->with('status', 'transfer-rejected');
    }

    private function validateBranch(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:40'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'business_hours' => ['nullable', 'array'],
        ]);
    }

    private function transform(Branch $b): array
    {
        $today = Carbon::today();
        $todaySales = Sale::where('branch_id', $b->id)
            ->where('status', 'completed')
            ->whereDate('sold_at', $today)
            ->sum('total');

        $stockValue = StockLevel::where('branch_id', $b->id)
            ->join('products', 'products.id', '=', 'stock_levels.product_id')
            ->sum(\Illuminate\Support\Facades\DB::raw('stock_levels.quantity * products.price'));

        $trend = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::today()->subDays($i);
            $revenue = Sale::where('branch_id', $b->id)
                ->where('status', 'completed')
                ->whereDate('sold_at', $day)
                ->sum('total');
            $trend[] = ['date' => $day->format('M j'), 'revenue' => (float) $revenue];
        }

        $staffList = $b->staff->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name, 'role' => $u->role])->values();

        $topStock = StockLevel::where('branch_id', $b->id)
            ->where('quantity', '>', 0)
            ->with('product:id,name,sku')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get()
            ->map(fn (StockLevel $l) => ['product' => $l->product?->name, 'sku' => $l->product?->sku, 'quantity' => $l->quantity]);

        return [
            'id' => $b->id,
            'name' => $b->name,
            'address' => $b->address,
            'phone' => $b->phone,
            'manager' => $b->manager ? ['id' => $b->manager->id, 'name' => $b->manager->name] : null,
            'business_hours' => $b->business_hours,
            'is_active' => $b->is_active,
            'staff_count' => $b->staff_count,
            'today_sales' => (float) $todaySales,
            'stock_value' => (float) $stockValue,
            'sales_trend' => $trend,
            'staff_list' => $staffList,
            'top_stock' => $topStock,
        ];
    }
}
