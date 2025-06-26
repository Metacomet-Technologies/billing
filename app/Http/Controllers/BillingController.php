<?php

namespace App\Http\Controllers;

use App\Models\License;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillingController
{
    /**
     * Create Stripe Checkout session for subscription.
     */
    public function createSubscriptionCheckout(Request $request)
    {
        $user = Auth::user();

        $checkout = $user->newSubscription('default', config('cashier.price_ids.subscription'))
            ->checkout([
                'success_url' => route('billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('billing.cancel'),
                'metadata' => [
                    'type' => License::TYPE_SUBSCRIPTION,
                ],
            ]);

        return response()->json([
            'checkout_url' => $checkout->url,
        ]);
    }

    /**
     * Create Stripe Checkout session for lifetime license.
     */
    public function createLifetimeCheckout(Request $request)
    {
        $user = Auth::user();

        $checkout = $user->checkout([
            config('cashier.price_ids.lifetime') => 1,
        ], [
            'success_url' => route('billing.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('billing.cancel'),
            'metadata' => [
                'type' => License::TYPE_LIFETIME,
            ],
        ]);

        return response()->json([
            'checkout_url' => $checkout->url,
        ]);
    }

    /**
     * Redirect to Stripe billing portal.
     */
    public function billingPortal(Request $request)
    {
        $user = Auth::user();

        return $user->redirectToBillingPortal(route('dashboard'));
    }

    /**
     * Handle successful checkout.
     */
    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if ($sessionId) {
            // Process the successful payment and create license
            $this->processSuccessfulPayment($sessionId);
        }

        return redirect()->route('dashboard')->with('success', 'Payment successful! Your license has been created.');
    }

    /**
     * Handle cancelled checkout.
     */
    public function cancel(Request $request)
    {
        return redirect()->route('dashboard')->with('error', 'Payment was cancelled.');
    }

    /**
     * Process successful payment and create license.
     */
    private function processSuccessfulPayment(string $sessionId)
    {
        $stripe = new \Stripe\StripeClient(config('cashier.secret'));
        $session = $stripe->checkout->sessions->retrieve($sessionId);

        $user = Auth::user();
        $type = $session->metadata->type ?? License::TYPE_SUBSCRIPTION;

        // Create the license
        $license = License::create([
            'user_id' => $user->id,
            'type' => $type,
            'stripe_id' => $session->subscription ?? $session->payment_intent,
            'status' => License::STATUS_PARKED,
        ]);

        return $license;
    }
}
