import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        items: [
            { name: 'Total Tenants', value: '12', change: '+20%', changeType: 'positive' },
            { name: 'Total Revenue', value: 'Rp 45.000.000', change: '+12%', changeType: 'positive' },
            { name: 'Active Users', value: '156', change: '+5%', changeType: 'positive' },
            { name: 'Pending Issues', value: '3', change: '-2', changeType: 'positive' },
        ]
    });

    // In real implementation, fetch from /admin/stats
    // useEffect(() => { ... }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard Global</h1>

            {/* Stats Grid */}
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.items.map((item) => (
                    <div key={item.name} className="glass overflow-hidden rounded-xl p-5 border border-gray-800">
                        <dt className="truncate text-sm font-medium text-gray-400">{item.name}</dt>
                        <dd className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-semibold text-white">{item.value}</span>
                            <span className={`text-sm font-medium ${item.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                                {item.change}
                            </span>
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="glass rounded-xl p-6 border border-gray-800">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Tenant Activity</h2>
                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-800">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">Tenant #{i} Registered</p>
                                            <p className="text-xs text-gray-400 truncate">New registration via referral</p>
                                        </div>
                                        <div className="inline-flex items-center text-xs text-gray-400">
                                            {i}h ago
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* System Status */}
                <div className="glass rounded-xl p-6 border border-gray-800">
                    <h2 className="text-lg font-semibold text-white mb-4">System Monitoring</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Server CPU</span>
                            <span className="text-sm text-green-400">12% (Healthy)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Memory Usage</span>
                            <span className="text-sm text-yellow-400">65% (Moderate)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Database Connections</span>
                            <span className="text-sm text-green-400">45/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
