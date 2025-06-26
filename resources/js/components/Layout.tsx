import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, CreditCard, Home, LogOut, Menu, Package, X } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

interface LayoutProps extends PropsWithChildren {
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    const page = usePage();
    const auth = (page.props as any).auth;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home, current: window.location.pathname === '/dashboard' },
        { name: 'Licenses', href: '/licenses', icon: Package, current: window.location.pathname.startsWith('/licenses') },
        { name: 'Billing', href: '/billing', icon: CreditCard, current: window.location.pathname.startsWith('/billing') },
    ];

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-gray-50">
                {/* Mobile sidebar */}
                <div className={`relative z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />

                    <div className="fixed inset-0 flex">
                        <div className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>

                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                                <div className="flex h-16 shrink-0 items-center">
                                    <h1 className="text-xl font-bold text-gray-900">Discord Bot Billing</h1>
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                                item.current
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <item.icon className="h-6 w-6 shrink-0" />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                        <div className="flex h-16 shrink-0 items-center">
                            <h1 className="text-xl font-bold text-gray-900">Discord Bot Billing</h1>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                        item.current
                                                            ? 'bg-gray-50 text-indigo-600'
                                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    {/* Top bar */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="h-6 w-px bg-gray-200 lg:hidden" />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <div className="relative flex flex-1"></div>
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <Bell className="h-6 w-6" />
                                </button>

                                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                                {/* Profile dropdown */}
                                <div className="relative">
                                    <div className="flex items-center gap-x-4">
                                        <span className="hidden lg:flex lg:items-center">
                                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                                                {auth.user.name}
                                            </span>
                                        </span>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            className="flex items-center gap-x-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
