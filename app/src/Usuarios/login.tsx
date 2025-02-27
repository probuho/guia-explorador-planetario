import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import useAuth from "../context/useAuth";
import RespuestaError from "../compononent/interfaces/Error";

const PaginaLogin = () => {
    const [email, setEmail] = useState("");
    const [contraseña, setContrasena] = useState("");
    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { //Verificacion de si ya se ha iniciado sesion, de ser el caso es redirigido
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/'); 
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:4000/iniciar-sesion", {
                email,
                contraseña,
            });

            login(response.data.user, response.data.token);
            navigate('/'); // Se redirige al iniciar sesion
        } catch (error: unknown) { 
            console.error("Hubo un error durante el inicio de sesión:", error);

            if (axios.isAxiosError(error)) { // En caso de un error de Axios
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    // La solicitud se realizo y el servidor respondio con un codigo de fallo
                    const responseData = axiosError.response.data as RespuestaError;
                    // Verificar si el error es por credenciales incorrectas
                    if (axiosError.response.status === 401) {
                        setError("Correo electrónico o contraseña incorrectos.");
                    } else {
                        setError(responseData.error || "Hubo un problema al iniciar sesión");
                    }
                } else if (axiosError.request) {
                    // La solicitud se hizo, pero no hubo respuesta
                    console.error("Error en la solicitud:", axiosError.message);
                    setError("Sin respuesta del servidor");
                } else {
                    // Un fallo en la configuración de la solicitud ocasiono el error
                    console.error("Fallo en el configuracion de la solicitud:", axiosError.message);
                    setError("Hubo un fallo al configurar la solicitud");
                }
            } else {
                    setError("Un error general ha ocurrido");
            }
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
           <div className="w-50 bg-white rounded p-3">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <h2>Iniciar Sesión</h2>
                    <div className="mb-2">
                        <label htmlFor="correo">Correo</label>
                        <input 
                            type="email" 
                            placeholder="Correo" 
                            className="form-control"
                            id="correo"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email" 
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="contraseña">Contraseña</label>
                        <input
                            type={mostrarContraseña ? "text" : "password"}
                            placeholder="Contraseña"
                            className="form-control"
                            id="contraseña"
                            value={contraseña}
                            onChange={(e) => setContrasena(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <label>
                        Mostrar Contraseña
                        <input
                            type="checkbox"
                            name="checkbox"
                            checked={mostrarContraseña}
                            onChange={() => setMostrarContraseña(!mostrarContraseña)}
                        />
                    </label>
                    <button type="submit" className="btn btn-success">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default PaginaLogin;