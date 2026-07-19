<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
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
});

require __DIR__.'/auth.php';
