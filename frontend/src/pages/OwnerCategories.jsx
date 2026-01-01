import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [processing, setProcessing] = useState(false);
    const [notification, setNotification] = useState(null);

    // Notification helper
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        api.get('/owner/categories')
            .then(({ data }) => setCategories(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await api.post('/owner/categories', { name: newCategory, is_active: true });
            setNewCategory("");
            setNewCategory("");
            fetchCategories();
            showNotification("Category added successfully!");
        } catch (error) {
            alert("Failed to add category");
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/owner/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert("Failed to delete category. It might be in use.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold gradient-text mb-8">Categories</h1>


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

            <div className="glass p-6 rounded-xl border border-gray-800 mb-8 max-w-xl">
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="New Category Name"
                        className="flex-1 bg-dark-900 border-gray-700 rounded-lg text-white px-4 py-2 focus:ring-primary focus:border-primary"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary-glow text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20"
                    >
                        {processing ? 'Adding...' : 'Add'}
                    </button>
                </form>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-gray-800 max-w-4xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-dark-800/50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">Name</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-200">
                                    {cat.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full text-xs">
                                        Active
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
