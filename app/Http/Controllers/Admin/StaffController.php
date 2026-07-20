<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Branch;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    private const PLAN_LIMITS = [
        'Starter' => 2,
        'Pro' => 15,
        'Enterprise' => null,
    ];

    private const ROLE_LABELS = [
        'owner' => 'Owner',
        'manager' => 'Manager',
        'cashier' => 'Cashier',
        'inventory_staff' => 'Inventory Staff',
    ];

    public function index(Request $request): Response
    {
        $filterUser = $request->integer('user');

        $staff = User::where('role', '!=', 'platform_admin')
            ->with('branches')
            ->orderByRaw("field(role, 'owner', 'manager', 'cashier', 'inventory_staff')")
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => $this->transform($u));

        $subscription = Subscription::first();
        $plan = $subscription?->plan ?? 'Starter';
        $limit = self::PLAN_LIMITS[$plan] ?? null;
        $used = User::where('role', '!=', 'platform_admin')->where('staff_status', '!=', 'suspended')->count();

        $logs = ActivityLog::with('user:id,name')
            ->when($filterUser, fn ($q) => $q->where('user_id', $filterUser))
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'user' => $log->user?->name ?? 'Unknown',
                'user_id' => $log->user_id,
                'action' => $log->action,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('Admin/Staff/Index', [
            'staff' => $staff,
            'branches' => Branch::orderBy('name')->get(['id', 'name']),
            'usage' => ['used' => $used, 'limit' => $limit, 'plan' => $plan],
            'activityLogs' => $logs,
            'filterUser' => $filterUser,
        ]);
    }

    public function invite(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'role' => ['required', 'in:manager,cashier,inventory_staff'],
            'branch_ids' => ['array'],
            'branch_ids.*' => ['exists:branches,id'],
        ]);

        $subscription = Subscription::first();
        $plan = $subscription?->plan ?? 'Starter';
        $limit = self::PLAN_LIMITS[$plan] ?? null;
        $used = User::where('role', '!=', 'platform_admin')->where('staff_status', '!=', 'suspended')->count();

        if ($limit !== null && $used >= $limit) {
            throw ValidationException::withMessages(['email' => "You've reached your {$plan} plan's staff limit ({$limit}). Upgrade to invite more team members."]);
        }

        $staff = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(24)),
            'role' => $validated['role'],
            'staff_status' => 'invited',
            'invited_at' => now(),
        ]);

        $staff->branches()->sync($validated['branch_ids'] ?? []);

        $this->log($request, "Invited {$staff->name} as ".self::ROLE_LABELS[$validated['role']]);

        return back()->with('status', 'staff-invited');
    }

    public function updateRole(Request $request, User $staff): RedirectResponse
    {
        $this->guardStaff($staff);

        $validated = $request->validate([
            'role' => ['required', 'in:manager,cashier,inventory_staff'],
        ]);

        $staff->update(['role' => $validated['role']]);
        $this->log($request, "Changed {$staff->name}'s role to ".self::ROLE_LABELS[$validated['role']]);

        return back()->with('status', 'role-updated');
    }

    public function reassignBranches(Request $request, User $staff): RedirectResponse
    {
        $this->guardStaff($staff);

        $validated = $request->validate([
            'branch_ids' => ['array'],
            'branch_ids.*' => ['exists:branches,id'],
        ]);

        $staff->branches()->sync($validated['branch_ids'] ?? []);
        $this->log($request, "Updated {$staff->name}'s branch assignment");

        return back()->with('status', 'branches-updated');
    }

    public function suspend(Request $request, User $staff): RedirectResponse
    {
        $this->guardStaff($staff);

        $staff->update(['staff_status' => 'suspended']);
        $this->log($request, "Suspended {$staff->name}");

        return back()->with('status', 'staff-suspended');
    }

    public function reactivate(Request $request, User $staff): RedirectResponse
    {
        $this->guardStaff($staff);

        $staff->update(['staff_status' => 'active']);
        $this->log($request, "Reactivated {$staff->name}");

        return back()->with('status', 'staff-reactivated');
    }

    public function simulateAccept(Request $request, User $staff): RedirectResponse
    {
        if ($staff->staff_status === 'invited') {
            $staff->update(['staff_status' => 'active']);
            ActivityLog::create([
                'user_id' => $staff->id,
                'action' => 'staff.accept_invite',
                'description' => 'Accepted invitation and activated the account',
                'ip_address' => $request->ip(),
            ]);
        }

        return back()->with('status', 'invite-accepted');
    }

    public function remove(Request $request, User $staff): RedirectResponse
    {
        $this->guardStaff($staff);

        $name = $staff->name;
        $staff->delete();
        $this->log($request, "Removed {$name} from the team");

        return back()->with('status', 'staff-removed');
    }

    private function guardStaff(User $staff): void
    {
        if (in_array($staff->role, ['owner', 'platform_admin'], true)) {
            throw ValidationException::withMessages(['role' => 'The store owner account cannot be modified here.']);
        }
    }

    private function log(Request $request, string $description): void
    {
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'staff.manage',
            'description' => $description,
            'ip_address' => $request->ip(),
        ]);
    }

    private function transform(User $u): array
    {
        return [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'role_label' => self::ROLE_LABELS[$u->role] ?? $u->role,
            'status' => $u->staff_status,
            'branches' => $u->branches->map(fn (Branch $b) => ['id' => $b->id, 'name' => $b->name]),
            'last_login_at' => $u->last_login_at?->diffForHumans(),
            'invited_at' => $u->invited_at?->format('d M Y'),
        ];
    }
}
