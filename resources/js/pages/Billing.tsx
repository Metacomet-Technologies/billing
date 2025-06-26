import { router } from '@inertiajs/react';
import { Check, CreditCard, Infinity as InfinityIcon, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import Layout from '../components/Layout';
import { useNotificationContext } from '../contexts/NotificationContext';

export default function Billing() {
    const [loading, setLoading] = useState<string | null>(null);
    const { addNotification } = useNotificationContext();

    const handleCheckout = async (type: 'subscription' | 'lifetime') => {
        setLoading(type);

        try {
            router.post(`/billing/checkout/${type}`, {}, {
                onFinish: () => setLoading(null),
                onError: (errors) => {
                    console.error('Checkout error:', errors);
                    addNotification('error', 'Checkout Failed', 'There was an error processing your checkout. Please try again.');
                    setLoading(null);
                }
            });
        } catch (error) {
            console.error('Failed to initiate checkout:', error);
            addNotification('error', 'Checkout Failed', 'An unexpected error occurred. Please try again.');
            setLoading(null);
        }
    };

    const subscriptionFeatures = [
        'Discord bot access',
        'Priority support',
        'Regular updates',
        'Cancel anytime',
        'Monthly billing'
    ];

    const lifetimeFeatures = [
        'Discord bot access',
        'Priority support',
        'Lifetime updates',
        'One-time payment',
        'No recurring fees',
        'Transfer between servers'
    ];

    return (
        <Layout title="Billing">
            <div className="mb-8">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Choose Your Plan
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                    Select the perfect plan for your Discord server. Start with a subscription or get lifetime access.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Subscription Plan */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center">
                        <h3 className="text-lg font-semibold leading-8 text-gray-900">
                            Monthly Subscription
                        </h3>
                        <Zap className="ml-2 h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        Perfect for trying out our bot with the flexibility to cancel anytime.
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">$9.99</span>
                        <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                    </p>
                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                        {subscriptionFeatures.map((feature, index) => (
                            <li key={index} className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-green-600" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => handleCheckout('subscription')}
                        disabled={loading === 'subscription'}
                        className="mt-8 w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading === 'subscription' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Start Subscription
                            </>
                        )}
                    </button>
                </div>

                {/* Lifetime Plan */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm ring-1 ring-blue-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold leading-8 text-gray-900">
                                Lifetime License
                            </h3>
                            <InfinityIcon className="ml-2 h-5 w-5 text-purple-600" />
                        </div>
                        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            Most Popular
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        One-time payment for unlimited access. Best value for long-term users.
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">$99.99</span>
                        <span className="text-sm font-semibold leading-6 text-gray-600">one-time</span>
                    </p>
                    <p className="mt-2 text-sm text-green-600 font-medium">
                        Save $20+ compared to 12 months subscription
                    </p>
                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                        {lifetimeFeatures.map((feature, index) => (
                            <li key={index} className="flex gap-x-3">
                                <Check className="h-6 w-5 flex-none text-green-600" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => handleCheckout('lifetime')}
                        disabled={loading === 'lifetime'}
                        className="mt-8 w-full rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading === 'lifetime' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Buy Lifetime License
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
                <h2 className="text-xl font-semibold text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Can I switch from subscription to lifetime?
                        </h3>
                        <p className="text-gray-600">
                            Yes! You can upgrade to a lifetime license at any time. Contact support for assistance with the upgrade process.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Can I transfer my license to another server?
                        </h3>
                        <p className="text-gray-600">
                            Yes, you can transfer your license between Discord servers with a 30-day cooldown period between transfers.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            What happens if I cancel my subscription?
                        </h3>
                        <p className="text-gray-600">
                            Your bot will continue to work until the end of your current billing period. You can reactivate anytime.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Do you offer refunds?
                        </h3>
                        <p className="text-gray-600">
                            We offer a 14-day money-back guarantee for both subscription and lifetime purchases. Contact support for refund requests.
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 rounded-lg bg-blue-50 p-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Secure Payment Processing
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                All payments are processed securely through Stripe. We never store your payment information on our servers.
                                You can manage your billing details and view invoices in the{' '}
                                <a
                                    href="/billing/portal"
                                    className="font-medium underline text-blue-800 hover:text-blue-600"
                                >
                                    billing portal
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
