<?php

namespace App\Http\Controllers;

use App\Models\License;
use Illuminate\Http\Request;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;

class WebhookController extends CashierWebhookController
{
    /**
     * Handle subscription created.
     */
    public function handleCustomerSubscriptionCreated(array $payload)
    {
        $data = $payload['data']['object'];
        $userId = $this->getUserByStripeId($data['customer']);

        if ($userId) {
            License::create([
                'user_id' => $userId,
                'type' => License::TYPE_SUBSCRIPTION,
                'stripe_id' => $data['id'],
                'status' => License::STATUS_PARKED,
            ]);
        }
    }

    /**
     * Handle successful checkout completion.
     */
    public function handleCheckoutSessionCompleted(array $payload)
    {
        $session = $payload['data']['object'];
        $userId = $this->getUserByStripeId($session['customer']);

        if ($userId && isset($session['metadata']['type'])) {
            $type = $session['metadata']['type'];

            // Only create license for lifetime purchases (subscriptions are handled above)
            if ($type === License::TYPE_LIFETIME) {
                License::create([
                    'user_id' => $userId,
                    'type' => $type,
                    'stripe_id' => $session['payment_intent'],
                    'status' => License::STATUS_PARKED,
                ]);
            }
        }
    }

    /**
     * Handle subscription cancellation.
     */
    public function handleCustomerSubscriptionDeleted(array $payload)
    {
        $data = $payload['data']['object'];

        $license = License::where('stripe_id', $data['id'])->first();
        if ($license) {
            // Park the license when subscription is cancelled
            $license->park();
        }
    }

    /**
     * Get user ID by Stripe customer ID.
     */
    protected function getUserByStripeId($stripeId)
    {
        $user = \App\Models\User::where('stripe_id', $stripeId)->first();
        return $user?->id;
    }
}
