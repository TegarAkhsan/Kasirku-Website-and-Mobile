import api from "../api/axios";

export const printReceipt = async (transaction) => {
    try {
        // Fetch Settings
        const { data: settings } = await api.get('/pos/settings/receipt');

        // Create or reuse hidden iframe
        let iframe = document.getElementById('pos-print-frame');
        if (iframe) {
            document.body.removeChild(iframe);
        }

        iframe = document.createElement('iframe');
        iframe.id = 'pos-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

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
                        margin: 0; 
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
                    <div class="bold" style="font-size: 1.2em; margin-bottom: 5px;">${settings.header_text || 'SaaS POS'}</div>
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

                ${settings.show_wifi ? `
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

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        // Wait for content (especially images) to load
        iframe.onload = () => {
            // Use a small timeout to ensure layout is complete
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            }, 500);
        };

    } catch (error) {
        console.error("Print Error", error);
        alert("Failed to print receipt");
    }
};
