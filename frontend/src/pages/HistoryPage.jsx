import { useState, useEffect } from "react";
import api from "../api/axios";

export default function HistoryPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/pos/transactions')
            .then(({ data }) => {
                setTransactions(data.data); // data.data because paginate
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto text-gray-100">
            <h1 className="text-2xl font-bold mb-6 gradient-text">Transaction History</h1>

            <div className="glass overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-dark-800 text-gray-400 border-b border-gray-700">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Transaction Code</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Items</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">Loading history...</td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">No transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-300">
                                        {new Date(trx.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-mono text-sm text-primary-glow">
                                        {trx.transaction_code || trx.id.slice(0, 8)}
                                    </td>
                                    <td className="p-4 font-bold">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.total_amount)}
                                    </td>
                                    <td className="p-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs border ${trx.payment_method === 'cash' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                                'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                            }`}>
                                            {trx.payment_method}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${trx.payment_status === 'success' ? 'text-green-400' :
                                                trx.payment_status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {trx.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {trx.items?.length || 0} items
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
