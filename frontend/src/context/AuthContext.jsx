import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);


useEffect(() => {
    // Get items from browser's local storage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // Corrected: localStorageUser -> localStorage

    // Check if both the token and user data exist
    if (storedToken && storedUser) { // Corrected: Check for both token and user
        setToken(storedToken);       // Corrected: setToekn -> setToken
        setUser(JSON.parse(storedUser));
    }
}, []);

useEffect(() => {
    if (token) {
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
    localStorage.removeItem("token");
        localStorage.removeItem("user");
    
};

return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
    </AuthContext.Provider>
);

};

export const useAuth = () => useContext(AuthContext);