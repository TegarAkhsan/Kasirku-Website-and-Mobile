import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/owner/dashboard')
            .then(({ data }) => setStats(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-indigo-400 animate-pulse">Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard Overview</h1>

            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass overflow-hidden rounded-xl p-6 relative group hover:bg-white/5 transition-all">
                    <dt className="text-sm font-medium text-gray-400">Total Sales Today</dt>
                    <dd className="mt-2 text-4xl font-bold text-gray-100">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats?.stats?.sales_today || 0)}
                    </dd>
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="h-16 w-16 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all"></div>
                    </div>
                </div>
                <div className="glass overflow-hidden rounded-xl p-6 relative group hover:bg-white/5 transition-all">
                    <dt className="text-sm font-medium text-gray-400">Transactions Today</dt>
                    <dd className="mt-2 text-4xl font-bold text-gray-100">
                        {stats?.stats?.transactions_today || 0}
                    </dd>
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="h-16 w-16 bg-pink-500/20 rounded-full blur-xl group-hover:bg-pink-500/30 transition-all"></div>
                    </div>
                </div>
                <div className="glass overflow-hidden rounded-xl p-6 relative group hover:bg-white/5 transition-all">
                    <dt className="text-sm font-medium text-gray-400">Total Stores</dt>
                    <dd className="mt-2 text-4xl font-bold text-gray-100">
                        {stats?.stats?.total_stores || 0}
                    </dd>
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <div className="h-16 w-16 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all"></div>
                    </div>
                </div>
            </dl>

            <div className="mt-10">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Recent Transactions</h2>
                <div className="glass rounded-xl overflow-hidden border border-gray-800">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-dark-800/50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">Code</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Total</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-transparent">
                            {stats?.recent_transactions?.map((trx) => (
                                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-primary-glow">
                                        {(trx.transaction_code || trx.id).substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.total_amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trx.payment_status === 'success'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {trx.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
