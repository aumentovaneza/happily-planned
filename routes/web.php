<?php

use App\Http\Controllers\BudgetAdvisorController;
use App\Http\Controllers\BudgetItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DrinksController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InspirationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimelineEventController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Default to the login page (or the dashboard when already signed in).
Route::get('/', fn () => redirect()->route(Auth::check() ? 'dashboard' : 'login'))
    ->name('home');

// Single shared household — the auth middleware is the only gate (no policies).
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Budget — running-cost spreadsheet, what-if sandbox, and AI advisor.
    Route::get('budget', [BudgetItemController::class, 'index'])->name('budget.index');
    Route::post('budget', [BudgetItemController::class, 'store'])->name('budget.store');
    Route::patch('budget/{budgetItem}', [BudgetItemController::class, 'update'])->name('budget.update');
    Route::delete('budget/{budgetItem}', [BudgetItemController::class, 'destroy'])->name('budget.destroy');
    Route::post('budget/advisor', [BudgetAdvisorController::class, 'generate'])->name('budget.advisor');

    Route::post('budget/{budgetItem}/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::patch('payments/{payment}', [PaymentController::class, 'update'])->name('payments.update');
    Route::delete('payments/{payment}', [PaymentController::class, 'destroy'])->name('payments.destroy');

    Route::resource('vendors', VendorController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('inspiration', InspirationController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('guests', GuestController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::patch('guests/{guest}/seat', [GuestController::class, 'assignSeat'])->name('guests.seat');

    Route::resource('checklist', TaskController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('timeline', TimelineEventController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('seating', TableController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['seating' => 'table']);

    // Drinks calculator (formula) + optional AI tip.
    Route::get('drinks', [DrinksController::class, 'index'])->name('drinks.index');
    Route::patch('drinks', [DrinksController::class, 'update'])->name('drinks.update');
    Route::post('drinks/tip', [DrinksController::class, 'tip'])->name('drinks.tip');
});

require __DIR__.'/settings.php';
