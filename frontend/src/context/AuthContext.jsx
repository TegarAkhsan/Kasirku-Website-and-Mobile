import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/user').then(({ data }) => {
                setUser(data);
            }).catch(() => {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return data;
    };

    const register = async (payload) => {
        const { data } = await api.post('/auth/register', payload);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return data;
    }

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
