import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerCashiers() {
    const [cashiers, setCashiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCashiers();
    }, []);

    const fetchCashiers = () => {
        setLoading(true);
        api.get('/owner/users')
            .then(({ data }) => setCashiers(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        api.post('/owner/users', formData)
            .then(() => {
                setIsModalOpen(false);
                setFormData({ name: '', email: '', password: '' });
                fetchCashiers();
            })
            .catch(err => alert(err.response?.data?.message || 'Failed to add cashier'))
            .finally(() => setProcessing(false));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold gradient-text">Cashier Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                    + Add Cashier
                </button>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-dark-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {cashiers.map((cashier) => (
                            <tr key={cashier.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cashier.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{cashier.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(cashier.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm p-4">
                    <div className="glass w-full max-w-md rounded-2xl p-6 border border-gray-700 shadow-2xl animate-bounce-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Cashier</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    {processing ? 'Adding...' : 'Add Cashier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
