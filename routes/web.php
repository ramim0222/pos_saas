<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\CustomerGroupController as AdminCustomerGroupController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\PurchaseOrderController as AdminPurchaseOrderController;
use App\Http\Controllers\Admin\ReportsController as AdminReportsController;
use App\Http\Controllers\Admin\SalesController as AdminSalesController;
use App\Http\Controllers\Admin\SupplierController as AdminSupplierController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Front/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/features', function () {
    return Inertia::render('Front/Features', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('features');

Route::get('/pricing', function () {
    return Inertia::render('Front/Pricing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('pricing');

Route::get('/about', function () {
    return Inertia::render('Front/About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('about');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [AdminProductController::class, 'index'])->name('index');
        Route::post('/', [AdminProductController::class, 'store'])->name('store');
        Route::put('/{product}', [AdminProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [AdminProductController::class, 'destroy'])->name('destroy');
        Route::post('/{product}/duplicate', [AdminProductController::class, 'duplicate'])->name('duplicate');
        Route::post('/bulk-destroy', [AdminProductController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::post('/bulk-category', [AdminProductController::class, 'bulkUpdateCategory'])->name('bulk-category');
        Route::get('/export', [AdminProductController::class, 'export'])->name('export');
        Route::post('/import', [AdminProductController::class, 'import'])->name('import');
    });

    Route::prefix('inventory')->name('inventory.')->group(function () {
        Route::get('/', [AdminInventoryController::class, 'index'])->name('index');
        Route::post('/adjust', [AdminInventoryController::class, 'adjust'])->name('adjust');
        Route::post('/transfer', [AdminInventoryController::class, 'transfer'])->name('transfer');
    });

    Route::prefix('purchases')->name('purchases.')->group(function () {
        Route::get('/', [AdminPurchaseOrderController::class, 'index'])->name('index');

        Route::prefix('orders')->name('orders.')->group(function () {
            Route::post('/', [AdminPurchaseOrderController::class, 'store'])->name('store');
            Route::put('/{purchaseOrder}', [AdminPurchaseOrderController::class, 'update'])->name('update');
            Route::delete('/{purchaseOrder}', [AdminPurchaseOrderController::class, 'destroy'])->name('destroy');
            Route::post('/{purchaseOrder}/send', [AdminPurchaseOrderController::class, 'send'])->name('send');
            Route::post('/{purchaseOrder}/receive', [AdminPurchaseOrderController::class, 'receive'])->name('receive');
            Route::post('/{purchaseOrder}/cancel', [AdminPurchaseOrderController::class, 'cancel'])->name('cancel');
        });

        Route::prefix('suppliers')->name('suppliers.')->group(function () {
            Route::post('/', [AdminSupplierController::class, 'store'])->name('store');
            Route::put('/{supplier}', [AdminSupplierController::class, 'update'])->name('update');
            Route::post('/{supplier}/deactivate', [AdminSupplierController::class, 'deactivate'])->name('deactivate');
            Route::post('/{supplier}/payments', [AdminSupplierController::class, 'storePayment'])->name('payments.store');
        });
    });

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::get('/', [AdminSalesController::class, 'index'])->name('index');
        Route::get('/export', [AdminSalesController::class, 'export'])->name('export');
        Route::post('/{sale}/refund', [AdminSalesController::class, 'refund'])->name('refund');
        Route::post('/{sale}/void', [AdminSalesController::class, 'void'])->name('void');
    });

    Route::prefix('customers')->name('customers.')->group(function () {
        Route::get('/', [AdminCustomerController::class, 'index'])->name('index');
        Route::post('/', [AdminCustomerController::class, 'store'])->name('store');
        Route::put('/{customer}', [AdminCustomerController::class, 'update'])->name('update');
        Route::post('/{customer}/points', [AdminCustomerController::class, 'adjustPoints'])->name('points');

        Route::prefix('groups')->name('groups.')->group(function () {
            Route::post('/', [AdminCustomerGroupController::class, 'store'])->name('store');
            Route::put('/{group}', [AdminCustomerGroupController::class, 'update'])->name('update');
        });
    });

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [AdminReportsController::class, 'index'])->name('index');
        Route::get('/export', [AdminReportsController::class, 'export'])->name('export');
    });
});

require __DIR__.'/auth.php';
