import { Link } from '@inertiajs/react';
import { CheckCircle, CreditCard, Package } from 'lucide-react';
import Layout from '../components/Layout';

export default function Success() {
    return (
        <Layout title="Payment Successful">
            <div className="min-h-96 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Your license has been created and is ready to be assigned to your Discord server.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/licenses"
                            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Manage Licenses
                        </Link>

                        <Link
                            href="/dashboard"
                            className="w-full inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex">
                            <CreditCard className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div className="ml-3 text-left">
                                <h3 className="text-sm font-medium text-blue-800">
                                    What's Next?
                                </h3>
                                <p className="mt-1 text-sm text-blue-700">
                                    Go to the Licenses page to assign your new license to a Discord server.
                                    You can also manage your billing and view invoices in the billing portal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
