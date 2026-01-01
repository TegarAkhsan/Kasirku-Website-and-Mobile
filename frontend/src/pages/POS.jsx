import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function POS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = (query = "") => {
        setLoading(true);
        api.get(`/pos/products?search=${query}`)
            .then(({ data }) => setProducts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.product_id === product.id);
        if (existing) {
            setCart(cart.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId, delta) => {
        setCart(cart.map(item => {
            if (item.product_id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate('/pos/payment', { state: { total, items: cart } });
    };

    return (
        <div className="flex h-full overflow-hidden bg-dark-900 text-gray-100">
            {/* Left: Products */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full rounded-xl bg-dark-800 border-gray-700 text-gray-100 shadow-[0_0_15px_rgba(0,0,0,0.2)] focus:border-primary focus:ring-primary p-4 pl-12 border transition-all placeholder-gray-500"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            fetchProducts(e.target.value);
                        }}
                    />
                    <svg className="absolute left-4 top-4.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {/* Grouping logic inside the render for simplicity or memoized above */}
                    {Object.entries(products.reduce((acc, product) => {
                        const categoryName = product.category ? product.category.name : 'Uncategorized';
                        if (!acc[categoryName]) acc[categoryName] = [];
                        acc[categoryName].push(product);
                        return acc;
                    }, {})).map(([categoryName, categoryProducts]) => (
                        <div key={categoryName} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-200 mb-4 px-2 border-l-4 border-primary pl-3 py-2 w-full rounded-r-lg bg-white/5">
                                {categoryName}
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryProducts.map(product => (
                                    <div key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="glass p-4 rounded-2xl shadow-lg cursor-pointer hover:bg-white/5 transition-all border border-gray-800 hover:border-primary/50 flex flex-col justify-between group relative overflow-hidden h-[250px]"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="w-full h-32 bg-dark-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden border border-gray-700/50 flex-shrink-0">
                                            {product.image ? (
                                                <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-600 text-xs">No Image</span>
                                            )}
                                        </div>
                                        <div className="relative z-10 flex flex-col flex-1 justify-between">
                                            <h3 className="font-semibold text-gray-100 text-base mb-1 line-clamp-2 leading-tight" title={product.name}>{product.name}</h3>
                                            <div className="flex justify-between items-end">
                                                <p className="text-gray-500 text-xs">Stock: <span className={product.stock < 10 ? 'text-red-400' : 'text-emerald-400'}>{product.stock}</span></p>
                                                <div className="font-bold text-primary-glow text-base">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && !loading && (
                        <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                            <p className="text-xl">No products found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-[400px] glass border-l border-gray-800/50 flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-gray-800/50 bg-dark-800/50">
                    <h2 className="text-xl font-bold gradient-text">Current Order</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.product_id} className="flex justify-between items-center bg-dark-800/50 p-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="flex-1 min-w-0 mr-4">
                                <h4 className="text-sm font-medium text-gray-200 truncate">{item.name}</h4>
                                <div className="text-xs text-primary-glow font-mono mt-1">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-dark-900 rounded-lg p-1 border border-gray-800">
                                <button onClick={() => updateQuantity(item.product_id, -1)} className="w-8 h-8 rounded-md bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-gray-300 transition-colors">-</button>
                                <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product_id, 1)} className="w-8 h-8 rounded-md bg-primary hover:bg-primary-glow flex items-center justify-center text-white transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)]">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.product_id)} className="ml-3 text-gray-500 hover:text-red-400 p-2 transition-colors">
                                &times;
                            </button>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <p>Cart is empty</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800/50 bg-dark-800/80 backdrop-blur-md">
                    <div className="flex justify-between text-lg font-medium text-gray-400 mb-2">
                        <span>Total Items</span>
                        <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold mb-6 text-white items-end">
                        <span>Total</span>
                        <span className="gradient-text">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || processing}
                        className="w-full bg-primary hover:bg-primary-glow text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                    >
                        {processing ? 'Processing...' : 'Proceed to Payment →'}
                    </button>
                </div>
            </div>

            {/* Payment Modal Placeholder - Will implement full page next */}
        </div>
    );
}
