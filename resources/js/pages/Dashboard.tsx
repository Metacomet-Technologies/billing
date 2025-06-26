import { Link } from '@inertiajs/react';
import { ArrowRight, CreditCard, Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface License {
    id: number;
    type: 'subscription' | 'lifetime';
    status: 'active' | 'parked';
    assigned_guild: {
        id: number;
        name: string;
        discord_id: string;
    } | null;
    can_be_transferred: boolean;
    transfer_available_at: string | null;
    last_assigned_at: string | null;
}

export default function Dashboard() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const response = await fetch('/licenses');
            const data = await response.json();
            setLicenses(data.licenses || []);
        } catch (error) {
            console.error('Failed to fetch licenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            name: 'Total Licenses',
            value: licenses.length,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            name: 'Active Licenses',
            value: licenses.filter(l => l.status === 'active').length,
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            name: 'Parked Licenses',
            value: licenses.filter(l => l.status === 'parked').length,
            icon: Package,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
    ];

    return (
        <Layout title="Dashboard">
            <div className="mb-8">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                    Welcome to your Discord Bot Billing dashboard. Manage your licenses and billing here.
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8">
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {stats.map((item) => (
                        <div
                            key={item.name}
                            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                        >
                            <dt>
                                <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                                    <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/billing"
                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <div className="flex-shrink-0">
                            <CreditCard className="h-10 w-10 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Purchase License</p>
                            <p className="text-sm text-gray-500">Buy subscription or lifetime license</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <Link
                        href="/licenses"
                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <div className="flex-shrink-0">
                            <Package className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Manage Licenses</p>
                            <p className="text-sm text-gray-500">Assign, park, or transfer licenses</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <a
                        href="/billing/portal"
                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                        <div className="flex-shrink-0">
                            <Users className="h-10 w-10 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">Billing Portal</p>
                            <p className="text-sm text-gray-500">Manage subscriptions and payments</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                    </a>
                </div>
            </div>

            {/* Recent Licenses */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Licenses</h2>
                {loading ? (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                ) : licenses.length === 0 ? (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No licenses</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by purchasing your first license.</p>
                        <div className="mt-6">
                            <Link
                                href="/billing"
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                <CreditCard className="-ml-0.5 mr-1.5 h-5 w-5" />
                                Purchase License
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {licenses.slice(0, 5).map((license) => (
                                <li key={license.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {license.type === 'subscription' ? 'Subscription' : 'Lifetime'} License
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {license.assigned_guild
                                                            ? `Assigned to ${license.assigned_guild.name}`
                                                            : 'Parked (not assigned)'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        license.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {license.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {licenses.length > 5 && (
                            <div className="bg-gray-50 px-4 py-3 sm:px-6">
                                <div className="text-sm">
                                    <Link
                                        href="/licenses"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        View all {licenses.length} licenses
                                        <span aria-hidden="true"> &rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
