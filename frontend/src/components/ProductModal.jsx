import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        description: "",
        is_active: true
    });
    const [categories, setCategories] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Fetch categories for dropdown
        api.get('/owner/categories').then(({ data }) => setCategories(data)).catch(console.error);
    }, [isOpen]); // Refresh when modal opens

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category_id: product.category_id || "",
                description: product.description || "",
                is_active: product.is_active
            });
        } else {
            setFormData({
                name: "",
                price: "",
                stock: "",
                category_id: "",
                description: "",
                is_active: true
            });
        }
    }, [product, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        if (formData.category_id) data.append('category_id', formData.category_id);
        data.append('description', formData.description);
        data.append('is_active', formData.is_active ? '1' : '0');
        if (formData.image) data.append('image', formData.image);

        if (product) {
            data.append('_method', 'PUT'); // Laravel requires this for FormData PUT
        }

        try {
            if (product) {
                // For file uploads with PUT, use POST + _method=PUT
                await api.post(`/owner/products/${product.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/owner/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to save product: " + (error.response?.data?.message || error.message));
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-lg rounded-2xl p-6 border border-gray-700 shadow-2xl animate-bounce-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-glow"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                        <select
                            className="w-full bg-dark-800 border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-primary focus:border-primary"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="rounded bg-dark-800 border-gray-700 text-primary focus:ring-primary"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-300">Active Product</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-dark-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-glow text-white font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
