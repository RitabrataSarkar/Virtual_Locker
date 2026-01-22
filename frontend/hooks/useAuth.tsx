'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, AuthResponse } from '@/types/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchCurrentUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch current user
    const fetchCurrentUser = async (authToken: string) => {
        try {
            const response = await axios.get<AuthResponse>(API_ENDPOINTS.AUTH_ME, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.success && response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
                username,
                password,
            });

            if (response.data.success && response.data.token && response.data.user) {
                const newToken = response.data.token;
                setToken(newToken);
                setUser(response.data.user);
                localStorage.setItem('token', newToken);
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    // Signup
    const signup = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post<AuthResponse>(API_ENDPOINTS.SIGNUP, {
                username,
                email,
                password,
            });

            if (response.data.success && response.data.token && response.data.user) {
                const newToken = response.data.token;
                setToken(newToken);
                setUser(response.data.user);
                localStorage.setItem('token', newToken);
            } else {
                throw new Error(response.data.message || 'Signup failed');
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
