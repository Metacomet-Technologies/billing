import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bot, CreditCard, Shield, Users, Zap } from 'lucide-react';

interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}

export default function Welcome({ canLogin, canRegister }: WelcomeProps) {
    return (
        <>
            <Head title="Welcome to Discord Bot Billing" />
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
                {/* Navigation */}
                <nav className="relative flex items-center justify-between p-6 lg:px-8">
                    <div className="flex items-center">
                        <Bot className="h-8 w-8 text-white mr-3" />
                        <span className="text-xl font-bold text-white">Discord Bot Billing</span>
                    </div>
                    {(canLogin || canRegister) && (
                        <div className="flex items-center space-x-4">
                            {canLogin && (
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold leading-6 text-white hover:text-blue-200"
                                >
                                    Log in
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50"
                                >
                                    Sign up
                                </Link>
                            )}
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                Premium Discord Bot
                                <span className="text-blue-300"> Licensing</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-blue-100">
                                Manage your Discord bot subscriptions and licenses with ease.
                                Choose between flexible monthly subscriptions or lifetime access.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {canRegister ? (
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center"
                                    >
                                        Get started
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                )}
                                <a
                                    href="#features"
                                    className="text-sm font-semibold leading-6 text-white hover:text-blue-200"
                                >
                                    Learn more <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-blue-300">
                                Everything you need
                            </h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Professional Discord Bot Management
                            </p>
                            <p className="mt-6 text-lg leading-8 text-blue-100">
                                Our platform provides comprehensive license management for Discord bots with
                                flexible billing options and enterprise-grade features.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <CreditCard className="h-5 w-5 flex-none text-blue-300" />
                                        Flexible Billing
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                        <p className="flex-auto">
                                            Choose between monthly subscriptions or one-time lifetime purchases.
                                            Cancel anytime with no hidden fees.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <Users className="h-5 w-5 flex-none text-blue-300" />
                                        Multi-Server Support
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                        <p className="flex-auto">
                                            Easily transfer licenses between Discord servers with built-in
                                            cooldown protection and admin verification.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                                        <Shield className="h-5 w-5 flex-none text-blue-300" />
                                        Secure & Reliable
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                        <p className="flex-auto">
                                            Enterprise-grade security with Stripe payment processing and
                                            robust license verification systems.
                                        </p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Pricing Preview */}
                <div className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Simple, transparent pricing
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-blue-100">
                                Start with a monthly subscription or save with our lifetime license option.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                            {/* Monthly Plan */}
                            <div className="rounded-3xl rounded-b-none bg-white/10 p-8 ring-1 ring-white/20 sm:mx-8 sm:rounded-b-3xl lg:mx-0 lg:rounded-r-none">
                                <h3 className="text-base font-semibold leading-7 text-blue-300">Monthly</h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-white">$9.99</span>
                                    <span className="text-base text-blue-100">/month</span>
                                </p>
                                <p className="mt-6 text-base leading-7 text-blue-100">
                                    Perfect for trying out our bot with flexibility to cancel anytime.
                                </p>
                                <ul className="mt-8 space-y-3 text-sm leading-6 text-blue-100">
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-300" />
                                        Full bot access
                                    </li>
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-300" />
                                        Priority support
                                    </li>
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-300" />
                                        Cancel anytime
                                    </li>
                                </ul>
                            </div>

                            {/* Lifetime Plan */}
                            <div className="rounded-3xl rounded-t-none bg-white p-8 ring-1 ring-gray-200 sm:mx-8 sm:rounded-t-3xl lg:mx-0 lg:rounded-l-none">
                                <h3 className="text-base font-semibold leading-7 text-blue-600">Lifetime</h3>
                                <p className="mt-4 flex items-baseline gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$99.99</span>
                                    <span className="text-base text-gray-500">one-time</span>
                                </p>
                                <p className="mt-6 text-base leading-7 text-gray-600">
                                    Best value for long-term users. Pay once, use forever.
                                </p>
                                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-600" />
                                        Everything in Monthly
                                    </li>
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-600" />
                                        Lifetime updates
                                    </li>
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-600" />
                                        Transfer between servers
                                    </li>
                                    <li className="flex gap-x-3">
                                        <Zap className="h-6 w-5 flex-none text-blue-600" />
                                        Save $20+ vs 12 months
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-32 border-t border-white/10">
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="text-center">
                            <p className="text-sm leading-5 text-blue-200">
                                &copy; 2025 Discord Bot Billing. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
