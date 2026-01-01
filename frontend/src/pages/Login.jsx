import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await login(email, password);
            if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (data.user.role === 'owner') {
                navigate('/owner/dashboard');
            } else {
                navigate('/pos');
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-900"
                    />
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Sign in
                </button>
            </div>
            <div className="text-sm text-center">
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Or register your store
                </Link>
            </div>
        </form>
    );
}
