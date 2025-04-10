import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const isAuthenticated = () => {
        return sessionStorage.getItem('authenticated') === 'true';
    };
    
    const login = () => {
        sessionStorage.setItem('authenticated', 'true');
    };
    
    const logout = () => {
        sessionStorage.removeItem('authenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};