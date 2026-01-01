import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductModal from "../components/ProductModal";

export default function OwnerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notification, setNotification] = useState(null);

    // Notification helper
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchProducts = () => {
        setLoading(true);
        api.get('/owner/products')
            .then(({ data }) => setProducts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold gradient-text">Products</h1>
                <button
                    onClick={handleAdd}
                    className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                    + Add Product
                </button>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-8 z-50 animate-fade-in-down">
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSuccess={() => {
                    fetchProducts();
                    showNotification("Product saved successfully!");
                }}
            />

            <div className="glass rounded-xl overflow-hidden border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-dark-800/50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">Name</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Price</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Stock</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {loading ? (
                            <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-400">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-400">No products found</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-200">
                                        {product.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        <span className={product.stock < 10 ? 'text-red-400 font-bold' : 'text-gray-300'}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-indigo-400 hover:text-indigo-300 mr-3"
                                        >
                                            Edit
                                        </button>
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
