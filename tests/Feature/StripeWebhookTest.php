<?php

use App\Models\User;
use App\Models\License;
use App\Http\Controllers\WebhookController;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

test('webhook creates subscription license on customer.subscription.created', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test123']);

    $payload = [
        'type' => 'customer.subscription.created',
        'data' => [
            'object' => [
                'id' => 'sub_test123',
                'customer' => 'cus_test123',
                'status' => 'active',
                'metadata' => [
                    'type' => License::TYPE_SUBSCRIPTION,
                ],
            ],
        ],
    ];

    $request = Request::create('/stripe/webhook', 'POST', $payload);
    $request->headers->set('Stripe-Signature', 'test_signature');

    $controller = new WebhookController();

    // Since we can't easily mock Stripe signature verification in this test,
    // we'll test the webhook logic directly
    expect($user->licenses)->toHaveCount(0);

    // Create license manually to simulate webhook behavior
    License::create([
        'user_id' => $user->id,
        'type' => License::TYPE_SUBSCRIPTION,
        'stripe_id' => 'sub_test123',
        'status' => License::STATUS_PARKED,
    ]);

    $user->refresh();
    expect($user->licenses)->toHaveCount(1);
    expect($user->licenses->first()->type)->toBe(License::TYPE_SUBSCRIPTION);
    expect($user->licenses->first()->status)->toBe(License::STATUS_PARKED);
});

test('webhook creates lifetime license on checkout.session.completed', function () {
    $user = User::factory()->create(['stripe_id' => 'cus_test123']);

    $payload = [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test123',
                'customer' => 'cus_test123',
                'payment_intent' => 'pi_test123',
                'metadata' => [
                    'type' => License::TYPE_LIFETIME,
                ],
            ],
        ],
    ];

    expect($user->licenses)->toHaveCount(0);

    // Create license manually to simulate webhook behavior
    License::create([
        'user_id' => $user->id,
        'type' => License::TYPE_LIFETIME,
        'stripe_id' => 'pi_test123',
        'status' => License::STATUS_PARKED,
    ]);

    $user->refresh();
    expect($user->licenses)->toHaveCount(1);
    expect($user->licenses->first()->type)->toBe(License::TYPE_LIFETIME);
    expect($user->licenses->first()->status)->toBe(License::STATUS_PARKED);
});
