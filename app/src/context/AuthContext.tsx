import React, { createContext, useState, useEffect } from "react";
import Usuario from "../compononent/interfaces/Usuario";

interface AuthContextType {
    loggedIn: boolean;
    user: Usuario | null;
    login: (user: Usuario, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<Usuario | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("usuario");
        if (token && storedUser && storedUser !== "undefined") {
            setLoggedIn(true);
            setUser(JSON.parse(storedUser));
        } else {
            setLoggedIn(false);
            setUser(null);
        }
    }, []);

    const login = (user: Usuario, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(user));
        setLoggedIn(true);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setLoggedIn(false);
        setUser(null);
    };

    const value: AuthContextType = {
        loggedIn,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;