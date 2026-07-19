<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $grocery = ProductCategory::firstOrCreate(['slug' => 'grocery'], ['name' => 'Grocery']);
        $beverages = ProductCategory::firstOrCreate(['slug' => 'beverages'], ['name' => 'Beverages']);
        $personalCare = ProductCategory::firstOrCreate(['slug' => 'personal-care'], ['name' => 'Personal Care']);
        $electronics = ProductCategory::firstOrCreate(['slug' => 'electronics'], ['name' => 'Electronics']);
        $apparel = ProductCategory::firstOrCreate(['slug' => 'apparel'], ['name' => 'Apparel']);

        $simpleProducts = [
            ['name' => 'Chinigura Rice, 5kg', 'category_id' => $grocery->id, 'brand' => 'Pran', 'price' => 620, 'branch_stocks' => ['Gulshan' => 42, 'Uttara' => 18, 'Mirpur' => 30, 'Chattogram' => 12]],
            ['name' => 'Cooking Oil, 5L', 'category_id' => $grocery->id, 'brand' => 'Rupchanda', 'price' => 890, 'branch_stocks' => ['Gulshan' => 20, 'Uttara' => 6, 'Mirpur' => 15, 'Chattogram' => 4]],
            ['name' => 'Lentils (Moshur Dal), 1kg', 'category_id' => $grocery->id, 'brand' => 'ACI', 'price' => 145, 'branch_stocks' => ['Gulshan' => 60, 'Uttara' => 25, 'Mirpur' => 40, 'Chattogram' => 18]],
            ['name' => 'Ispahani Tea, 400g', 'category_id' => $beverages->id, 'brand' => 'Ispahani', 'price' => 210, 'branch_stocks' => ['Gulshan' => 8, 'Uttara' => 2, 'Mirpur' => 5, 'Chattogram' => 0]],
            ['name' => 'Mineral Water, 1.5L', 'category_id' => $beverages->id, 'brand' => 'Mum', 'price' => 40, 'branch_stocks' => ['Gulshan' => 120, 'Uttara' => 80, 'Mirpur' => 95, 'Chattogram' => 60]],
            ['name' => 'Detergent Powder, 1kg', 'category_id' => $personalCare->id, 'brand' => 'Surf Excel', 'price' => 260, 'branch_stocks' => ['Gulshan' => 14, 'Uttara' => 3, 'Mirpur' => 9, 'Chattogram' => 1]],
            ['name' => 'Toothpaste, 100g', 'category_id' => $personalCare->id, 'brand' => 'Sensodyne', 'price' => 180, 'branch_stocks' => ['Gulshan' => 0, 'Uttara' => 0, 'Mirpur' => 0, 'Chattogram' => 0]],
        ];

        foreach ($simpleProducts as $data) {
            Product::firstOrCreate(
                ['sku' => 'SKU-'.Str::upper(Str::random(6))],
                [
                    'name' => $data['name'],
                    'category_id' => $data['category_id'],
                    'brand' => $data['brand'],
                    'unit_type' => 'pcs',
                    'tax_class' => 'standard',
                    'status' => 'active',
                    'price' => $data['price'],
                    'branch_stocks' => $data['branch_stocks'],
                    'reorder_point' => 10,
                    'barcode' => $this->generateBarcode(),
                ],
            );
        }

        $mobileCase = Product::firstOrCreate(
            ['sku' => 'ELEC-CASE-01'],
            [
                'name' => 'Phone Case — Universal',
                'category_id' => $electronics->id,
                'brand' => 'Nillkin',
                'unit_type' => 'pcs',
                'tax_class' => 'standard',
                'status' => 'active',
                'price' => 350,
                'reorder_point' => 10,
                'barcode' => $this->generateBarcode(),
            ],
        );

        if ($mobileCase->variants()->count() === 0) {
            $mobileCase->variants()->createMany([
                ['name' => 'Black', 'sku' => 'ELEC-CASE-01-BLK', 'price' => 350, 'stock' => 22, 'attributes' => ['Color' => 'Black']],
                ['name' => 'Clear', 'sku' => 'ELEC-CASE-01-CLR', 'price' => 350, 'stock' => 14, 'attributes' => ['Color' => 'Clear']],
                ['name' => 'Blue', 'sku' => 'ELEC-CASE-01-BLU', 'price' => 380, 'stock' => 3, 'attributes' => ['Color' => 'Blue']],
            ]);
        }

        $tshirt = Product::firstOrCreate(
            ['sku' => 'APRL-TSHIRT-01'],
            [
                'name' => 'Cotton T-Shirt',
                'category_id' => $apparel->id,
                'brand' => 'Yellow',
                'unit_type' => 'pcs',
                'tax_class' => 'standard',
                'status' => 'active',
                'price' => 590,
                'reorder_point' => 15,
                'barcode' => $this->generateBarcode(),
            ],
        );

        if ($tshirt->variants()->count() === 0) {
            $tshirt->variants()->createMany([
                ['name' => 'S / White', 'sku' => 'APRL-TSHIRT-01-SW', 'price' => 590, 'stock' => 18, 'attributes' => ['Size' => 'S', 'Color' => 'White']],
                ['name' => 'M / White', 'sku' => 'APRL-TSHIRT-01-MW', 'price' => 590, 'stock' => 25, 'attributes' => ['Size' => 'M', 'Color' => 'White']],
                ['name' => 'L / White', 'sku' => 'APRL-TSHIRT-01-LW', 'price' => 590, 'stock' => 9, 'attributes' => ['Size' => 'L', 'Color' => 'White']],
                ['name' => 'M / Black', 'sku' => 'APRL-TSHIRT-01-MB', 'price' => 620, 'stock' => 0, 'attributes' => ['Size' => 'M', 'Color' => 'Black']],
            ]);
        }

        Product::firstOrCreate(
            ['sku' => 'ELEC-CHARGER-01'],
            [
                'name' => 'Fast Charger, 20W',
                'category_id' => $electronics->id,
                'brand' => 'Anker',
                'unit_type' => 'pcs',
                'tax_class' => 'standard',
                'status' => 'inactive',
                'price' => 1450,
                'branch_stocks' => ['Gulshan' => 5, 'Uttara' => 0, 'Mirpur' => 2, 'Chattogram' => 0],
                'reorder_point' => 5,
                'barcode' => $this->generateBarcode(),
            ],
        );
    }

    private function generateBarcode(): string
    {
        $digits = '';
        for ($i = 0; $i < 12; $i++) {
            $digits .= random_int(0, 9);
        }

        $sum = 0;
        foreach (str_split($digits) as $index => $digit) {
            $sum += $index % 2 === 0 ? (int) $digit : (int) $digit * 3;
        }
        $checkDigit = (10 - ($sum % 10)) % 10;

        return $digits.$checkDigit;
    }
}
