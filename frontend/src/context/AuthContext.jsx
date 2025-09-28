import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    
    useEffect(() => {
        if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }, [token, user]);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);