import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReceiptModal from "../components/ReceiptModal";
import QRCode from "react-qr-code";

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { total, items } = location.state || { total: 0, items: [] };

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [cashReceived, setCashReceived] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [change, setChange] = useState(0);
    const [notes, setNotes] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    // Core API State
    const [selectedBank, setSelectedBank] = useState('bca');
    const [paymentInfo, setPaymentInfo] = useState(null); // { type, va_number, qr_string, bank, account_number, ... }
    const [currentTransactionId, setCurrentTransactionId] = useState(null);
    const [completedTransaction, setCompletedTransaction] = useState(null);

    // Auto-poll status
    useEffect(() => {
        let interval;
        if (paymentInfo && currentTransactionId && !showSuccess) {
            interval = setInterval(() => {
                api.get(`/pos/transactions/${currentTransactionId}`)
                    .then(({ data }) => {
                        if (data.payment_status === 'success') {
                            setShowSuccess(true);
                        }
                    })
                    .catch(err => console.error("Polling error:", err));
            }, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [paymentInfo, currentTransactionId, showSuccess]);


    useEffect(() => {
        if (!location.state) {
            navigate('/pos');
        } else {
            // Auto-fill cash received with total initially
            setCashReceived(total);
        }
    }, [location, navigate, total]);

    useEffect(() => {
        if (paymentMethod === 'cash') {
            setChange(cashReceived - total);
        } else {
            setChange(0);
        }
    }, [cashReceived, total, paymentMethod]);

    const handlePayment = async () => {
        if (paymentMethod === 'cash' && cashReceived < total) {
            alert('Insufficient cash!');
            return;
        }

        setProcessing(true);
        try {
            const { data } = await api.post('/pos/transactions', {
                items: items.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
                payment_method: paymentMethod,
                amount_paid: paymentMethod === 'cash' ? parseFloat(cashReceived) : total,
                notes: notes,
                table_number: tableNumber,
                bank_name: paymentMethod === 'bank' ? selectedBank : undefined
            });

            // Store transaction for receipt
            if (data.transaction) {
                setCompletedTransaction(data.transaction);
            }

            if (data.payment_info) {
                // Core API Response
                setPaymentInfo(data.payment_info);
                setCurrentTransactionId(data.transaction.id);
            } else {
                // Cash Payment
                setShowSuccess(true);
            }
        } catch (e) {
            alert('Transaction Failed: ' + (e.response?.data?.message || e.message));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="h-full w-full bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-6xl h-full glass rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-800">

                {/* Left Side: Order Summary */}
                <div className="w-full md:w-2/5 h-full bg-dark-800/80 p-8 border-r border-gray-800/50 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 flex-shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Order Summary
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start border-b border-gray-800 pb-4 last:border-0">
                                <div>
                                    <h4 className="text-gray-200 font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</p>
                                </div>
                                <div className="text-gray-200 font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700 flex-shrink-0">
                        <div className="flex justify-between items-center bg-dark-900/50 p-4 rounded-xl border border-gray-800">
                            <span className="text-gray-400">Total Bill</span>
                            <span className="text-2xl font-bold gradient-text">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Logic */}
                <div className="w-full md:w-3/5 h-full p-8 bg-dark-900/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

                    <div className="space-y-6">
                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Table Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-800 border-gray-700 rounded-xl text-white px-4 py-3 focus:ring-primary focus:border-primary placeholder-gray-600"
                                    placeholder="ex: 12"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-800 border-gray-700 rounded-xl text-white px-4 py-3 focus:ring-primary focus:border-primary placeholder-gray-600"
                                    placeholder="Add notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3">Select Payment Method</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['cash', 'qris', 'bank'].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 capitalize ${paymentMethod === method
                                            ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                            : 'bg-dark-800 border-gray-700 text-gray-400 hover:bg-dark-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <span className="font-bold text-lg">{method}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Payment Content */}
                        <div className="bg-dark-800/50 rounded-2xl p-6 border border-gray-800 min-h-[300px] flex flex-col justify-center">
                            {/* Payment Result Display */}
                            {paymentInfo ? (
                                <div className="text-center animate-fade-in w-full flex flex-col items-center">
                                    {paymentInfo.type === 'qris' && (
                                        <div className="space-y-6 flex flex-col items-center">
                                            <h3 className="text-2xl font-bold text-white mb-4">Scan QRIS to Pay</h3>
                                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                                <QRCode value={paymentInfo.qr_string} size={200} />
                                            </div>
                                            <p className="text-gray-400 text-sm max-w-xs text-center">
                                                Scan using GoPay, OVO, Dana, ShopeePay or Mobile Banking
                                            </p>
                                        </div>
                                    )}

                                    {paymentInfo.type === 'bank_transfer' && (
                                        <div className="space-y-6 w-full">
                                            <h3 className="text-xl font-bold text-white">Virtual Account Payment</h3>

                                            <div className="bg-dark-700/50 p-6 rounded-xl border border-gray-600 text-left space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bank</p>
                                                    <p className="text-lg font-bold text-white">{paymentInfo.bank_code}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Account Number</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-3xl font-mono font-bold text-primary tracking-widest">
                                                            {paymentInfo.account_number}
                                                        </p>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(paymentInfo.account_number).then(() => alert('Copied!'))}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                {paymentInfo.expiration_date && (
                                                    <div>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Expires At</p>
                                                        <p className="text-sm text-gray-300">
                                                            {new Date(paymentInfo.expiration_date).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {paymentInfo.type === 'invoice' && (
                                        // Fallback if invoice legacy used
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-white">Payment Link Created!</h3>
                                            <a
                                                href={paymentInfo.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transform transition-all hover:-translate-y-1"
                                            >
                                                Pay Now via Xendit ↗
                                            </a>
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-gray-700 w-full">
                                        <p className="text-yellow-400/80 text-xs mb-4">
                                            *Payment status is checked automatically every few seconds.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setProcessing(true);
                                                api.get(`/pos/transactions/${currentTransactionId}`)
                                                    .then(({ data }) => {
                                                        if (data.payment_status === 'success') {
                                                            setShowSuccess(true);
                                                        } else {
                                                            alert("Payment status: " + data.payment_status);
                                                        }
                                                    })
                                                    .finally(() => setProcessing(false));
                                            }}
                                            className="w-full px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                                        >
                                            Check Status Manually
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Selection UI rendering remains same
                                <>
                                    {paymentMethod === 'cash' && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                                <span>Cash Received</span>
                                                <button onClick={() => setCashReceived(total)} className="text-primary hover:underline text-xs">Auto-fill Exact</button>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                                                <input
                                                    type="number"
                                                    className="w-full bg-dark-900 border-gray-700 rounded-xl text-white pl-12 pr-4 py-4 text-xl font-bold focus:ring-primary focus:border-primary"
                                                    value={cashReceived}
                                                    onChange={(e) => setCashReceived(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                                                <span className="text-gray-400">Change Return</span>
                                                <span className={`text-xl font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(change)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {(paymentMethod === 'qris' || paymentMethod === 'bank') && (
                                        <div className="text-center space-y-4 animate-fade-in flex flex-col items-center justify-center h-full">
                                            <div className="bg-white/5 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-200">Online Payment</h3>
                                            <p className="text-gray-400 max-w-xs">
                                                Generate {paymentMethod === 'qris' ? 'QRIS Code' : 'Virtual Account'} directly here.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        {!paymentInfo && (
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => navigate('/pos')}
                                    className="w-1/3 py-4 rounded-xl border border-gray-700 text-gray-400 font-bold hover:bg-dark-800 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={processing || (paymentMethod === 'cash' && change < 0)}
                                    className="flex-1 py-4 bg-primary hover:bg-primary-glow text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : 'Confirm Payment'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {
                showSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-md animate-fade-in">
                        <div className="bg-dark-800 p-8 rounded-3xl shadow-2xl border border-gray-700 text-center max-w-sm w-full mx-4 transform transition-all scale-100 animate-bounce-in">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                                <svg className="w-10 h-10 text-white animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                            <p className="text-gray-400 mb-6">Transaction has been recorded.</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/pos')}
                                    className="w-full py-3 bg-primary hover:bg-primary-glow text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
                                >
                                    Start New Order
                                </button>
                                <button
                                    onClick={() => setShowReceiptModal(true)}
                                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {showReceiptModal && (
                <ReceiptModal
                    transaction={completedTransaction}
                    onClose={() => setShowReceiptModal(false)}
                />
            )}
        </div>
    );
}
