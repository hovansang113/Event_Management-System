import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storage';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            const rawUser = localStorage.getItem(STORAGE_KEYS.USER);

            if (token && rawUser) {
                try {
                    // Basic token expiry check
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const isExpired = payload.exp && payload.exp * 1000 < Date.now();
                    
                    if (isExpired) {
                        logout();
                    } else {
                        setUser(JSON.parse(rawUser));
                        setIsLoggedIn(true);
                    }
                } catch (e) {
                    logout();
                }
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        };

        checkAuth();
        
        // Listen for storage changes (for multi-tab support)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return { user, isLoggedIn, logout };
};
