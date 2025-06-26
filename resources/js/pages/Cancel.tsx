import { Link } from '@inertiajs/react';
import { ArrowLeft, XCircle } from 'lucide-react';
import Layout from '../components/Layout';

export default function Cancel() {
    return (
        <Layout title="Payment Cancelled">
            <div className="min-h-96 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <XCircle className="h-6 w-6 text-red-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Cancelled
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Your payment was cancelled. No charges were made to your account.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/billing"
                            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Billing
                        </Link>

                        <Link
                            href="/dashboard"
                            className="w-full inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="text-sm font-medium text-yellow-800">
                            Need Help?
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700">
                            If you experienced any issues during checkout, please contact our support team for assistance.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
