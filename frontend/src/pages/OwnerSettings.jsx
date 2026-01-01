import { useState, useEffect } from "react";
import api from "../api/axios";

import Toast from "../components/Toast";

export default function OwnerSettings() {
    const [settings, setSettings] = useState({
        header_text: '',
        address: '',
        footer_text: '',
        show_logo: false,
        check_wifi: false, // UI state
        wifi_ssid: '',
        wifi_password: '', // Should be secret? Usually printed.
        paper_size: '58mm'
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        api.get('/pos/settings/receipt')
            .then(({ data }) => {
                setSettings({
                    ...data,
                    check_wifi: data.show_wifi
                });
                if (data.logo_url) setLogoPreview(data.logo_url);
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('header_text', settings.header_text || '');
        formData.append('address', settings.address || '');
        formData.append('footer_text', settings.footer_text || '');
        formData.append('show_logo', settings.show_logo ? '1' : '0');
        formData.append('show_wifi', settings.check_wifi ? '1' : '0');
        formData.append('wifi_ssid', settings.wifi_ssid || '');
        formData.append('wifi_password', settings.wifi_password || '');
        formData.append('paper_size', settings.paper_size);

        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            await api.post('/settings/receipt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setToast({ message: 'Settings Saved Successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to save settings', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto text-gray-100">
            <h1 className="text-2xl font-bold mb-6 gradient-text">Receipt Settings</h1>

            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-gray-800 space-y-6">

                {/* Logo Section */}
                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.show_logo}
                            onChange={e => setSettings({ ...settings, show_logo: e.target.checked })}
                            className="form-checkbox bg-dark-700 border-gray-600 rounded text-primary"
                        />
                        <span className="font-bold">Show Logo</span>
                    </label>

                    {settings.show_logo && (
                        <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-xl border border-dashed border-gray-600">
                            {logoPreview && (
                                <img src={logoPreview} alt="Logo" className="h-16 w-16 object-contain bg-white rounded" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setLogoFile(file);
                                        setLogoPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                            />
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Header Text (Shop Name)</label>
                        <textarea
                            value={settings.header_text || ''}
                            onChange={e => setSettings({ ...settings, header_text: e.target.value })}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Address</label>
                        <textarea
                            value={settings.address || ''}
                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Footer Text (Thank You Note)</label>
                        <textarea
                            value={settings.footer_text || ''}
                            onChange={e => setSettings({ ...settings, footer_text: e.target.value })}
                            className="w-full bg-dark-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
                            rows="3"
                        ></textarea>
                    </div>
                </div>

                {/* WiFi Section */}
                <div className="p-4 bg-dark-800/50 rounded-xl space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.check_wifi}
                            onChange={e => setSettings({ ...settings, check_wifi: e.target.checked })}
                            className="form-checkbox bg-dark-700 border-gray-600 rounded text-primary"
                        />
                        <span className="font-bold">Print WiFi Credentials</span>
                    </label>

                    {settings.check_wifi && (
                        <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">SSID (Network Name)</label>
                                <input
                                    type="text"
                                    value={settings.wifi_ssid || ''}
                                    onChange={e => setSettings({ ...settings, wifi_ssid: e.target.value })}
                                    className="w-full bg-dark-900 border border-gray-700 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                                <input
                                    type="text"
                                    value={settings.wifi_password || ''}
                                    onChange={e => setSettings({ ...settings, wifi_password: e.target.value })}
                                    className="w-full bg-dark-900 border border-gray-700 rounded-lg p-2"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Paper Size</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="paper" value="58mm" checked={settings.paper_size === '58mm'} onChange={e => setSettings({ ...settings, paper_size: e.target.value })} />
                            <span>58mm (Thermal)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="paper" value="80mm" checked={settings.paper_size === '80mm'} onChange={e => setSettings({ ...settings, paper_size: e.target.value })} />
                            <span>80mm (Standard)</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary hover:bg-indigo-500 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>

            </form>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
