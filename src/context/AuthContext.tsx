import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode'; // Use named import for jwt-decode
import { useNavigate } from 'react-router-dom';

interface User {
    id: number; // Add this line
    username: string;
    email: string;
    roles: string[];
    exp: number; // Expiration time as Unix timestamp
}

interface AuthContextProps {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, rememberMe: boolean) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const login = (token: string, rememberMe: boolean) => {
        if (rememberMe) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
        try {
            const decoded = jwtDecode<User>(token); // Explicitly type the jwtDecode result
            setUser(decoded);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Invalid token:', error);
            logout();
        }
    };

    const logout = async () => {
        /*
        try {
            await axiosInstance.post('/api/auth/logout'); // Assuming a logout endpoint
        } catch (err) {
            console.error('Logout error:', err);
        }

         */
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser(decoded);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
