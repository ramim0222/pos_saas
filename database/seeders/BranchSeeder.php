<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Product;
use App\Models\StockLevel;
use App\Models\TransferRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $kamal = User::where('email', 'kamal@dokan.app')->first();
        $rima = User::where('email', 'rima@dokan.app')->first();
        $owner = User::where('email', 'test@example.com')->first();

        $defaultHours = collect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            ->map(fn ($day) => ['day' => $day, 'open' => '09:00', 'close' => '21:00', 'closed' => false])
            ->all();

        $branchDetails = [
            'Gulshan' => ['phone' => '01711-990001', 'address' => 'House 14, Road 7, Gulshan-1, Dhaka 1212', 'manager' => $kamal],
            'Uttara' => ['phone' => '01711-990002', 'address' => 'Sector 7, Road 3, Uttara, Dhaka 1230', 'manager' => $kamal],
            'Mirpur' => ['phone' => '01711-990003', 'address' => 'Mirpur-10 Circle, Dhaka 1216', 'manager' => $rima],
            'Chattogram' => ['phone' => '01711-990004', 'address' => 'GEC Circle, Chattogram 4000', 'manager' => $rima],
        ];

        foreach ($branchDetails as $name => $details) {
            Branch::where('name', $name)->update([
                'phone' => $details['phone'],
                'address' => $details['address'],
                'manager_id' => $details['manager']?->id,
                'business_hours' => $defaultHours,
            ]);
        }

        if (TransferRequest::count() > 0 || ! $owner) {
            return;
        }

        $gulshan = Branch::where('name', 'Gulshan')->first();
        $mirpur = Branch::where('name', 'Mirpur')->first();
        $uttara = Branch::where('name', 'Uttara')->first();
        $chattogram = Branch::where('name', 'Chattogram')->first();

        $requests = [
            ['product' => 'Chinigura Rice, 5kg', 'from' => $mirpur, 'to' => $gulshan, 'qty' => 5, 'notes' => 'Gulshan is low on stock ahead of the weekend rush.', 'daysAgo' => 1],
            ['product' => 'Mineral Water, 1.5L', 'from' => $uttara, 'to' => $chattogram, 'qty' => 40, 'notes' => 'Chattogram branch requested extra stock for a local event.', 'daysAgo' => 0],
            ['product' => 'Lentils (Moshur Dal), 1kg', 'from' => $chattogram, 'to' => $mirpur, 'qty' => 5, 'notes' => null, 'daysAgo' => 2],
        ];

        foreach ($requests as $req) {
            $product = Product::where('name', $req['product'])->first();
            if (! $product) {
                continue;
            }

            $available = StockLevel::where('product_id', $product->id)
                ->where('branch_id', $req['from']->id)
                ->whereNull('variant_id')
                ->value('quantity');

            if (($available ?? 0) < $req['qty']) {
                continue;
            }

            $when = Carbon::now()->subDays($req['daysAgo']);

            TransferRequest::create([
                'product_id' => $product->id,
                'variant_id' => null,
                'quantity' => $req['qty'],
                'from_branch_id' => $req['from']->id,
                'to_branch_id' => $req['to']->id,
                'requested_by' => $owner->id,
                'notes' => $req['notes'],
                'status' => 'pending',
                'created_at' => $when,
                'updated_at' => $when,
            ]);
        }
    }
}
