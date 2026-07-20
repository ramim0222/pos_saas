<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $branches = Branch::pluck('id', 'name');

        $owner = User::where('email', 'test@example.com')->first();
        if ($owner) {
            $owner->update([
                'role' => 'owner',
                'staff_status' => 'active',
                'last_login_at' => Carbon::now()->subMinutes(12),
            ]);
            $owner->branches()->sync($branches->values());
        }

        $platformAdmin = User::where('email', 'admin@dokan.app')->first();
        if ($platformAdmin && $platformAdmin->role !== 'platform_admin') {
            $platformAdmin->update(['role' => 'platform_admin']);
        }

        $rima = User::where('email', 'rima@dokan.app')->first();
        if ($rima && $rima->role !== 'manager') {
            $rima->update([
                'role' => 'manager',
                'staff_status' => 'active',
                'last_login_at' => Carbon::now()->subHours(3),
            ]);
            $rima->branches()->sync([$branches['Mirpur'], $branches['Chattogram']]);
        }

        $kamal = User::where('email', 'kamal@dokan.app')->first();
        if ($kamal && $kamal->role !== 'cashier') {
            $kamal->update([
                'role' => 'cashier',
                'staff_status' => 'active',
                'last_login_at' => Carbon::now()->subDay(),
            ]);
            $kamal->branches()->sync([$branches['Gulshan'], $branches['Uttara']]);
        }

        if (! User::where('email', 'nasrin@dokan.app')->exists()) {
            $nasrin = User::create([
                'name' => 'Nasrin Sultana',
                'email' => 'nasrin@dokan.app',
                'password' => Hash::make('password'),
                'role' => 'inventory_staff',
                'staff_status' => 'invited',
                'invited_at' => Carbon::now()->subDays(2),
            ]);
            $nasrin->branches()->sync([$branches['Gulshan']]);
        }

        if (! User::where('email', 'habib@dokan.app')->exists()) {
            $habib = User::create([
                'name' => 'Habib Rahman',
                'email' => 'habib@dokan.app',
                'password' => Hash::make('password'),
                'role' => 'cashier',
                'staff_status' => 'suspended',
                'last_login_at' => Carbon::now()->subDays(18),
            ]);
            $habib->branches()->sync([$branches['Chattogram']]);
        }

        if (ActivityLog::count() === 0 && $owner) {
            $entries = [
                ['user' => $owner, 'action' => 'login', 'description' => 'Logged in', 'minutesAgo' => 12],
                ['user' => $owner, 'action' => 'staff.invite', 'description' => 'Invited Nasrin Sultana as Inventory Staff', 'minutesAgo' => 60 * 24 * 2],
                ['user' => $rima, 'action' => 'login', 'description' => 'Logged in', 'minutesAgo' => 60 * 3],
                ['user' => $rima, 'action' => 'sale.refund', 'description' => 'Processed a refund for INV-8006', 'minutesAgo' => 60 * 4],
                ['user' => $kamal, 'action' => 'login', 'description' => 'Logged in', 'minutesAgo' => 60 * 24],
                ['user' => $kamal, 'action' => 'inventory.adjust', 'description' => 'Adjusted stock for Detergent Powder, 1kg', 'minutesAgo' => 60 * 25],
                ['user' => $owner, 'action' => 'staff.suspend', 'description' => 'Suspended Habib Rahman', 'minutesAgo' => 60 * 24 * 18],
                ['user' => $habib, 'action' => 'login', 'description' => 'Logged in', 'minutesAgo' => 60 * 24 * 19],
            ];

            foreach ($entries as $entry) {
                if (! $entry['user']) {
                    continue;
                }
                $when = Carbon::now()->subMinutes($entry['minutesAgo']);
                ActivityLog::create([
                    'user_id' => $entry['user']->id,
                    'action' => $entry['action'],
                    'description' => $entry['description'],
                    'ip_address' => '103.87.'.rand(10, 99).'.'.rand(10, 250),
                    'created_at' => $when,
                    'updated_at' => $when,
                ]);
            }
        }
    }
}
