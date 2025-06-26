<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\LicenseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebhookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Billing routes
    Route::prefix('billing')->name('billing.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Billing');
        })->name('index');
        Route::post('/checkout/subscription', [BillingController::class, 'createSubscriptionCheckout'])
            ->name('checkout.subscription');
        Route::post('/checkout/lifetime', [BillingController::class, 'createLifetimeCheckout'])
            ->name('checkout.lifetime');
        Route::get('/portal', [BillingController::class, 'billingPortal'])
            ->name('portal');
        Route::get('/success', function () {
            return Inertia::render('Success');
        })->name('success');
        Route::get('/cancel', function () {
            return Inertia::render('Cancel');
        })->name('cancel');
    });

    // License management routes
    Route::prefix('licenses')->name('licenses.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Licenses');
        })->name('index');
        Route::get('/guilds/available', [LicenseController::class, 'availableGuilds'])
            ->name('guilds.available');
    });
    Route::apiResource('licenses', LicenseController::class)->only(['index', 'show', 'update']);

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Stripe webhooks (unprotected)
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');

require __DIR__.'/auth.php';
