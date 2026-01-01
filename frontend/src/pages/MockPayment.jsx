import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MockPayment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState('pending');

    const handleApprove = () => {
        setProcessing(true);
        api.post(`/pos/transactions/${id}/mock-pay`)
            .then(() => {
                setStatus('success');
                setTimeout(() => {
                    // Close tab or redirect. Since this is likely a new tab, closing is appropriate if possible, 
                    // or redirect to a success page.
                    // But usually Invoices open in new tab.
                    window.close();
                }, 2000);
            })
            .catch(err => {
                alert('Mock Payment Failed: ' + (err.response?.data?.message || err.message));
                setProcessing(false);
            });
    };

    if (status === 'success') {
        return (
            <div className="h-screen w-full bg-green-900 flex flex-col items-center justify-center text-white p-4">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="opacity-80">You can now close this window.</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />

            <div className="bg-dark-800 p-8 rounded-3xl shadow-2xl border border-gray-700 max-w-md w-full text-center relative z-10">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Xendit Simulation</h1>
                <p className="text-gray-400 mb-8">This is a mock payment page for testing purposes only.</p>

                <div className="bg-dark-900 p-4 rounded-xl border border-gray-700 mb-6 text-left">
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-white font-mono break-all">{id}</p>
                    <p className="text-sm text-gray-500 mt-2">Amount</p>
                    <p className="text-xl font-bold text-emerald-400">IDR 100.000 (Example)</p>
                </div>

                <button
                    onClick={handleApprove}
                    disabled={processing}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all"
                >
                    {processing ? 'Processing...' : 'Simulate Success Payment'}
                </button>

                <p className="text-xs text-gray-600 mt-4">
                    Do not use this in production.
                </p>
            </div>
        </div>
    );
}
