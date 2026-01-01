import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

export default function ReceiptModal({ transaction, onClose }) {
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef(null);

    useEffect(() => {
        const fetchSettingsAndGenerate = async () => {
            try {
                const { data: settings } = await api.get('/pos/settings/receipt');

                const width = settings.paper_size === '80mm' ? '78mm' : '56mm';
                const fontSize = settings.paper_size === '80mm' ? '14px' : '12px';

                const lines = transaction.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="flex: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.product?.name || 'Item'} (${item.quantity}x)</span>
                        <span style="flex: 1; text-align: right;">${new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</span>
                    </div>
                `).join('');

                const html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Receipt</title>
                        <style>
                            @page { margin: 0; }
                            body { 
                                font-family: 'Courier New', Courier, monospace; 
                                width: ${width}; 
                                margin: 0 auto; 
                                padding: 10px 5px; 
                                background: white; 
                                color: black;
                                font-size: ${fontSize};
                            }
                            .text-center { text-align: center; }
                            .text-right { text-align: right; }
                            .bold { font-weight: bold; }
                            .divider { border-top: 1px dashed black; margin: 10px 0; }
                            .logo { max-width: 60%; margin-bottom: 5px; display: block; margin-left: auto; margin-right: auto; }
                            .info { font-size: 0.9em; margin-bottom: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="text-center">
                            ${settings.show_logo && settings.logo_url ? `<img src="${settings.logo_url}" class="logo" />` : ''}
                            <div class="bold" style="font-size: 1.2em; margin-bottom: 2px;">${settings.header_text || 'SaaS POS'}</div>
                            ${settings.address ? `<div class="info" style="margin-bottom: 5px;">${settings.address}</div>` : ''}
                            <div class="info">${new Date(transaction.created_at).toLocaleString('id-ID')}</div>
                            <div class="info">#${transaction.transaction_code || transaction.id.slice(0, 8)}</div>
                        </div>

                        <div class="divider"></div>

                        ${lines}

                        <div class="divider"></div>

                        <div style="display: flex; justify-content: space-between;">
                            <span class="bold">Total</span>
                            <span class="bold">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total_amount)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
                            <span>Method</span>
                            <span style="text-transform: capitalize;">${transaction.payment_method}</span>
                        </div>

                        ${(settings.show_wifi === true || settings.show_wifi === 1 || settings.show_wifi === '1') ? `
                            <div class="divider"></div>
                            <div class="text-center">
                                <div class="bold">WIFI ACCESS</div>
                                <div>SSID: ${settings.wifi_ssid || '-'}</div>
                                <div>Pass: ${settings.wifi_password || '-'}</div>
                            </div>
                        ` : ''}

                        <div class="divider"></div>
                        
                        <div class="text-center info">
                            ${settings.footer_text || 'Thank you!'}
                        </div>
                    </body>
                    </html>
                `;

                setHtmlContent(html);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load settings, using defaults", error);

                // Fallback to defaults
                const settings = {
                    paper_size: '58mm',
                    header_text: 'Store Receipt',
                    address: 'Jl. Example No. 123',
                    footer_text: 'Thank You',
                    show_logo: false,
                    show_wifi: false
                };

                // Re-run generation logic with defaults (Simplified copy)
                const width = '56mm';
                const fontSize = '12px';
                const lines = transaction.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span style="flex: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.product?.name || 'Item'} (${item.quantity}x)</span>
                        <span style="flex: 1; text-align: right;">${new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</span>
                    </div>
                `).join('');

                const html = `<!DOCTYPE html><html><head><title>Receipt</title><style>@page{margin:0}body{font-family:'Courier New',Courier,monospace;width:${width};margin:0 auto;padding:10px 5px;background:white;color:black;font-size:${fontSize}}.text-center{text-align:center}.text-right{text-align:right}.bold{font-weight:bold}.divider{border-top:1px dashed black;margin:10px 0}.info{font-size:0.9em;margin-bottom:5px}</style></head><body><div class="text-center"><div class="bold" style="font-size:1.2em;margin-bottom:5px">${settings.header_text}</div><div class="info">${new Date(transaction.created_at).toLocaleString('id-ID')}</div><div class="info">#${transaction.transaction_code || transaction.id.slice(0, 8)}</div></div><div class="divider"></div>${lines}<div class="divider"></div><div style="display:flex;justify-content:space-between"><span class="bold">Total</span><span class="bold">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.total_amount)}</span></div><div class="divider"></div><div class="text-center info">${settings.footer_text}</div></body></html>`;

                setHtmlContent(html);
                setLoading(false);
            }
        };

        fetchSettingsAndGenerate();
    }, [transaction]);

    const handlePrint = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.focus();
            iframeRef.current.contentWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Receipt Preview</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 bg-gray-100 p-4 overflow-auto flex justify-center">
                    {loading ? (
                        <div className="text-gray-500">Loading Preview...</div>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            srcDoc={htmlContent}
                            className="bg-white shadow-sm"
                            style={{ width: '100%', maxWidth: '300px', height: '400px', border: 'none' }}
                            title="Receipt Preview"
                        />
                    )}
                </div>

                <div className="p-4 border-t border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5 border border-transparent hover:border-gray-700 transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Now
                    </button>
                </div>
            </div>
        </div>
    );
}
