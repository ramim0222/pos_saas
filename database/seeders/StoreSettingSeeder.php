<?php

namespace Database\Seeders;

use App\Models\StoreSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class StoreSettingSeeder extends Seeder
{
    public function run(): void
    {
        if (StoreSetting::count() > 0) {
            return;
        }

        $owner = User::where('email', 'test@example.com')->first();
        if (! $owner) {
            return;
        }

        StoreSetting::create([
            'user_id' => $owner->id,
            'store_name' => $owner->store_name ?? 'Dokan General Store',
            'address' => 'House 14, Road 7, Gulshan-1, Dhaka 1212',
            'phone' => '01711-223344',
            'email' => 'contact@dokan.app',
            'business_hours' => [
                ['day' => 'Monday', 'open' => '09:00', 'close' => '21:00', 'closed' => false],
                ['day' => 'Tuesday', 'open' => '09:00', 'close' => '21:00', 'closed' => false],
                ['day' => 'Wednesday', 'open' => '09:00', 'close' => '21:00', 'closed' => false],
                ['day' => 'Thursday', 'open' => '09:00', 'close' => '21:00', 'closed' => false],
                ['day' => 'Friday', 'open' => '14:30', 'close' => '21:00', 'closed' => false],
                ['day' => 'Saturday', 'open' => '09:00', 'close' => '21:00', 'closed' => false],
                ['day' => 'Sunday', 'open' => '09:00', 'close' => '18:00', 'closed' => false],
            ],
            'receipt_logo_enabled' => true,
            'receipt_header' => 'Thank you for shopping with us!',
            'receipt_footer' => "Returns accepted within 7 days with receipt.\nVAT Reg: 000123456-0002",
            'tax_inclusive' => false,
            'tax_classes' => [
                ['name' => 'standard', 'label' => 'Standard', 'rate' => 5],
                ['name' => 'reduced', 'label' => 'Reduced', 'rate' => 2.5],
                ['name' => 'zero', 'label' => 'Zero-rated', 'rate' => 0],
            ],
            'currency_symbol' => '৳',
            'currency_code' => 'BDT',
            'date_format' => 'd M Y',
            'timezone' => 'Asia/Dhaka',
            'last_backup_at' => Carbon::now()->subHours(7),
            'notify_low_stock' => true,
            'notify_daily_sales_email' => true,
        ]);
    }
}
