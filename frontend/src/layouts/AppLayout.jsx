import { useState } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
    const { user, logout, token, loading } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/owner/dashboard', roles: ['owner'] },
        { name: 'Categories', href: '/owner/categories', roles: ['owner'] },
        { name: 'My Stores', href: '/owner/stores', roles: ['owner'] },
        { name: 'Kasir', href: '/owner/users', roles: ['owner'] },
        { name: 'Products', href: '/owner/products', roles: ['owner'] },
        { name: 'Reports', href: '/owner/reports', roles: ['owner'] },
        { name: 'Settings', href: '/owner/settings', roles: ['owner'] },
        { name: 'POS', href: '/pos', roles: ['kasir'] },

        // Super Admin
        { name: 'Dashboard', href: '/admin/dashboard', roles: ['admin'] },
        { name: 'Tenants', href: '/admin/tenants', roles: ['admin'] },
        { name: 'Packages', href: '/admin/packages', roles: ['admin'] },
        { name: 'Transactions', href: '/admin/transactions', roles: ['admin'] },
        { name: 'Users', href: '/admin/users', roles: ['admin'] },
        { name: 'Monitoring', href: '/admin/monitoring', roles: ['admin'] },
    ];

    const filteredNav = navigation.filter(item => item.roles.includes(user?.role));
    const isCashier = user?.role === 'kasir';

    const handleCloseShift = () => {
        api.post('/pos/shift/close')
            .then(({ data }) => {
                alert(`Shift Closed Successfully.\nTotal Sales: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_sales)}`);
                logout();
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    // No open shift found, just logout
                    logout();
                } else {
                    console.error(err);
                    alert("Error closing shift: " + (err.response?.data?.message || err.message));
                }
            });
    };

    return (
        <div className="flex h-screen bg-dark-900 overflow-hidden relative">
            {/* Close Shift Modal */}
            {showCloseShiftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-dark-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Close Shift?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                This will end your current session and calculate total sales. Is the cash drawer reconciled?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowCloseShiftModal(false)}
                                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 border border-transparent hover:border-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCloseShift}
                                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Confirm Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar - Hidden for Cashier */}
            {!isCashier && (
                <div className="hidden md:flex md:w-64 md:flex-col glass border-r border-gray-800/50">
                    <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-800/50">
                        <h1 className="text-xl font-bold gradient-text">{user?.tenant?.name || 'SaaS POS'}</h1>
                    </div>
                    <nav className="flex-1 space-y-2 px-4 py-4">
                        {filteredNav.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-primary/20 text-primary-glow shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-primary/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-gray-800/50">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Header for Cashier or Mobile */}
                <header className={`flex h-16 items-center justify-between border-b border-gray-800/50 glass px-4 shadow-sm sm:px-6 lg:px-8 ${!isCashier ? 'md:hidden' : ''} z-10 relative`}>
                    {!isCashier && (
                        <button type="button" className="-m-2.5 p-2.5 text-gray-400 lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    )}

                    {/* Logo (Left) */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold gradient-text">{user?.tenant?.name || 'SaaS POS'}</h1>
                        {!isCashier && !user?.tenant?.name && <span className="ml-2 text-xs text-gray-500">POS</span>}
                    </div>

                    {/* Centered Nav for Cashier */}
                    {isCashier && (
                        <div className="hidden sm:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-1 bg-dark-800/50 p-1 rounded-xl border border-gray-700/50 backdrop-blur-md">
                            <Link to="/pos" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/pos' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                New Transaction
                            </Link>
                            <Link to="/pos/history" className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/pos/history' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                History
                            </Link>
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {isCashier ? (
                            <>
                                <button
                                    onClick={() => setShowCloseShiftModal(true)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
                                >
                                    <span>Close Shift</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 border border-gray-700 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // Mobile Logout/Profile for Non-Cashier (if needed here)
                            <div className="flex items-center gap-4 lg:hidden">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-dark-900 custom-scrollbar">
                    <div className={`h-full ${!isCashier ? 'py-6 px-4 sm:px-6 lg:px-8' : ''}`}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
