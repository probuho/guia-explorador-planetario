import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import Usuario from "../componente/interfaces/Usuario";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//Interfaces 
interface AuthContextType {
    auth: { user: Usuario, token: string } | null;
    setAuth: React.Dispatch<React.SetStateAction<{ user: Usuario, token: string } | null>>;
    login: (user: Usuario, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    headers: CustomAxiosHeaders;
}

interface CustomAxiosHeaders extends AxiosHeaders {
    Authorization: string;
}
//Codigo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<{ user: Usuario, token: string } | null>(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        if(auth){
            localStorage.setItem('auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('auth')
        }
    }, [auth]);

    const login = (user: Usuario, accessToken: string, refreshToken: string) => {
        setAuth({ user, token: accessToken });
        localStorage.setItem('auth', JSON.stringify({ user, token: accessToken }));
        localStorage.setItem('refreshToken', refreshToken); // Almacenar el nuevo token
    };

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error("No se encontro un nuevo token");
            }
            const response = await axios.post(`${BACKEND_URL}/refrescar-token`, { refreshToken });
            const { accessToken } = response.data;
            if (auth && auth.user) {
                setAuth({ user: auth.user, token: accessToken });
                localStorage.setItem('auth', JSON.stringify({ user: auth.user, token: accessToken }));
            }
            return accessToken;
        } catch (error) {
            console.error('Error al refrescar el token:', error);
            logout();
            return null;
        }
    };

    const logout = async () => {
        try {
            console.log("Token being sent:", auth?.token);
            await axios.post(`${BACKEND_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            });
            setAuth(null);
            localStorage.removeItem('refreshToken');
            navigate('/iniciar-sesion');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

        axios.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newAccessToken = await refreshToken();
                    if (newAccessToken && originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Asignar directamente
                        return axios(originalRequest as CustomAxiosRequestConfig); // Usar el tipo personalizado
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;