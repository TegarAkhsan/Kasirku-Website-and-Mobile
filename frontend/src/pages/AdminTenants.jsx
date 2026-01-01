import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminTenants() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tenants (mock or real if API exists)
        // api.get('/admin/tenants').then...

        // Mock data for display
        setTimeout(() => {
            setTenants([
                { id: 1, name: 'Toko Sukses Jaya', owner: 'Budi Santoso', status: 'active', plan: 'Pro' },
                { id: 2, name: 'Cafe Kopi Kenangan', owner: 'Ani Wijaya', status: 'active', plan: 'Basic' },
                { id: 3, name: 'Warung Makan Enak', owner: 'Joko', status: 'suspended', plan: 'Free' },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold gradient-text">Tenants (Toko)</h1>
                <button className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                    Register New Tenant
                </button>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-dark-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tenant Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-400">Loading...</td></tr>
                        ) : tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tenant.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.owner?.name || 'No Owner'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs uppercase font-bold">
                                        Standard
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tenant.status === 'active'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {tenant.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-400 hover:text-indigo-300 mr-4">Details</button>
                                    <button className="text-red-400 hover:text-red-300">Suspend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
