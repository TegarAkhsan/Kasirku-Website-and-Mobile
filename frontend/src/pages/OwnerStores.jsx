import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function OwnerStores() {
    const { user, login } = useAuth(); // We might need to refresh user context
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewStats, setViewStats] = useState(null); // ID of store to view stats for
    const [statsData, setStatsData] = useState(null);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = () => {
        setLoading(true);
        api.get('/owner/stores')
            .then(({ data }) => setStores(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setProcessing(true);
        api.post('/owner/stores', formData)
            .then(() => {
                setIsModalOpen(false);
                setFormData({ name: '', address: '', phone: '' });
                fetchStores();
            })
            .catch(err => alert(err.response?.data?.message || 'Failed to add store'))
            .finally(() => setProcessing(false));
    };

    const handleSwitch = async (id) => {
        if (!confirm("Switch to this store? Your session will update.")) return;
        try {
            await api.post(`/owner/stores/${id}/switch`);
            window.location.reload(); // Reload to refresh all data with new tenant context
        } catch (error) {
            alert("Failed to switch store");
        }
    };

    const loadStats = (id) => {
        if (viewStats === id) {
            setViewStats(null); // Close
            return;
        }
        setStatsData(null);
        setViewStats(id);
        api.get(`/owner/stores/${id}/stats`)
            .then(({ data }) => setStatsData(data))
            .catch(console.error);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">My Stores</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage multiple outlets and view statistics.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                    + Add New Store
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <div key={store.id} className={`glass p-6 rounded-xl border transition-all ${user.tenant_id === store.id ? 'border-primary ring-1 ring-primary' : 'border-gray-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{store.name}</h3>
                                {user.tenant_id === store.id && <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded ml-2">Current</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => loadStats(store.id)} className="text-gray-400 hover:text-white" title="View Stats">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </button>
                                {user.tenant_id !== store.id && (
                                    <button onClick={() => handleSwitch(store.id)} className="text-gray-400 hover:text-green-400" title="Switch to this store">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-2">{store.address || 'No address'}</p>
                        <p className="text-gray-500 text-xs">{store.phone}</p>

                        {/* Stats Expansion */}
                        {viewStats === store.id && (
                            <div className="mt-4 pt-4 border-t border-gray-700 animate-slide-in">
                                {statsData ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 text-sm">Revenue</span>
                                            <span className="text-white font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(statsData.revenue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 text-sm">Transactions</span>
                                            <span className="text-white font-bold">{statsData.transactions}</span>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-xs text-gray-400 mb-1">Last 6 Months Revenue</p>
                                            <div className="flex items-end gap-1 h-20">
                                                {statsData.chart_data.map((d, i) => (
                                                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group" style={{ height: `${Math.max(10, (d.revenue / (Math.max(...statsData.chart_data.map(x => Number(x.revenue))) || 1)) * 100)}%` }}>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-xs p-1 rounded whitespace-nowrap z-10">
                                                            {new Intl.NumberFormat('id-ID', { compactDisplay: 'short', notation: 'compact' }).format(d.revenue)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-2 text-xs text-gray-500">Loading stats...</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm p-4">
                    <div className="glass w-full max-w-md rounded-2xl p-6 border border-gray-700 shadow-2xl animate-bounce-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Store</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Store Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-dark-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-glow text-white font-bold"
                                >
                                    {processing ? 'Create Store' : 'Create Store'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
