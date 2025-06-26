import { router } from '@inertiajs/react';
import { ArrowRight, Calendar, Loader2, Package, Plus, RefreshCw, Server, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNotificationContext } from '../contexts/NotificationContext';

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

interface Guild {
    id: number;
    name: string;
    discord_id: string;
}

export default function Licenses() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [availableGuilds, setAvailableGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedLicense, setSelectedLicense] = useState<number | null>(null);
    const [selectedGuild, setSelectedGuild] = useState<number | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const { addNotification } = useNotificationContext();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [licensesResponse, guildsResponse] = await Promise.all([
                fetch('/licenses'),
                fetch('/licenses/guilds/available')
            ]);

            const licensesData = await licensesResponse.json();
            const guildsData = await guildsResponse.json();

            setLicenses(licensesData.licenses || []);
            setAvailableGuilds(guildsData.guilds || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLicense = async () => {
        if (!selectedLicense || !selectedGuild) return;

        setActionLoading('assign');

        try {
            const response = await fetch(`/licenses/${selectedLicense}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    action: 'assign',
                    guild_id: selectedGuild,
                }),
            });

            if (response.ok) {
                await fetchData();
                setShowAssignModal(false);
                setSelectedLicense(null);
                setSelectedGuild(null);
                addNotification('success', 'License Assigned', 'License has been successfully assigned to the server.');
            } else {
                const error = await response.json();
                addNotification('error', 'Assignment Failed', error.message || 'Failed to assign license');
            }
        } catch (error) {
            console.error('Failed to assign license:', error);
            addNotification('error', 'Assignment Failed', 'An unexpected error occurred while assigning the license.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleParkLicense = async (licenseId: number) => {
        setActionLoading(`park-${licenseId}`);

        try {
            const response = await fetch(`/licenses/${licenseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    action: 'park',
                }),
            });

            if (response.ok) {
                await fetchData();
                addNotification('success', 'License Parked', 'License has been successfully parked and is now available for assignment.');
            } else {
                const error = await response.json();
                addNotification('error', 'Park Failed', error.message || 'Failed to park license');
            }
        } catch (error) {
            console.error('Failed to park license:', error);
            addNotification('error', 'Park Failed', 'An unexpected error occurred while parking the license.');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString();
    };

    const openAssignModal = (licenseId: number) => {
        setSelectedLicense(licenseId);
        setShowAssignModal(true);
    };

    if (loading) {
        return (
            <Layout title="Licenses">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Licenses">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            License Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage your Discord bot licenses, assign them to servers, or park them for later use.
                        </p>
                    </div>
                    <button
                        onClick={() => router.visit('/billing')}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Buy License
                    </button>
                </div>
            </div>

            {licenses.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No licenses</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by purchasing your first license.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.visit('/billing')}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Purchase License
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {licenses.map((license) => (
                        <div
                            key={license.id}
                            className="bg-white shadow rounded-lg p-6 border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {license.type === 'subscription' ? (
                                            <Zap className="h-8 w-8 text-blue-600" />
                                        ) : (
                                            <Package className="h-8 w-8 text-purple-600" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {license.type === 'subscription' ? 'Subscription' : 'Lifetime'} License
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <Calendar className="mr-1 h-4 w-4" />
                                                Last assigned: {formatDate(license.last_assigned_at)}
                                            </span>
                                            {license.transfer_available_at && (
                                                <span className="flex items-center">
                                                    <RefreshCw className="mr-1 h-4 w-4" />
                                                    Transfer available: {formatDate(license.transfer_available_at)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
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

                            <div className="mt-4">
                                {license.assigned_guild ? (
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <Server className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {license.assigned_guild.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {license.assigned_guild.discord_id}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleParkLicense(license.id)}
                                            disabled={actionLoading === `park-${license.id}`}
                                            className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === `park-${license.id}` ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Package className="mr-2 h-4 w-4" />
                                            )}
                                            Park License
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <Package className="h-5 w-5 text-yellow-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    License Parked
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    This license is not assigned to any Discord server
                                                </p>
                                            </div>
                                        </div>
                                        {availableGuilds.length > 0 ? (
                                            <button
                                                onClick={() => openAssignModal(license.id)}
                                                disabled={!license.can_be_transferred}
                                                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                Assign to Server
                                            </button>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No available servers to assign
                                            </p>
                                        )}
                                    </div>
                                )}

                                {!license.can_be_transferred && license.transfer_available_at && (
                                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <p className="text-sm text-orange-800">
                                            This license cannot be transferred until {formatDate(license.transfer_available_at)} due to the 30-day cooldown period.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Assign License to Server
                            </h3>
                            <div className="space-y-3">
                                {availableGuilds.map((guild) => (
                                    <label key={guild.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="guild"
                                            value={guild.id}
                                            checked={selectedGuild === guild.id}
                                            onChange={(e) => setSelectedGuild(Number(e.target.value))}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-900">{guild.name}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedLicense(null);
                                        setSelectedGuild(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignLicense}
                                    disabled={!selectedGuild || actionLoading === 'assign'}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading === 'assign' ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        'Assign License'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
