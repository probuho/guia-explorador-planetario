import React, { useState, useEffect } from "react";
import axios, { AxiosError} from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import RespuestaError from "../compononent/interfaces/Error";
import "../styles.scss";

const PaginaRegistro = () => {
    const [nombre, setNombre] = useState<unknown | null>(null);
    const [apellido, setApellido] = useState<unknown | null>(null);
    const [nickname, setNickname] = useState<unknown | null>(null);
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [verificarContraseña, setVerificarContraseña] = useState('');
    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [errorRegistro, setErrorRegistro] = useState(""); // Para errores especificos
    const [errorGeneral, setErrorGeneral] = useState("")
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { // Verificación de si ya se esta registrado
        const authData = localStorage.getItem('auth');
        if (authData) {
            navigate('/especies'); // Redirecciona si ya esta iniciada la sesión
        }
    }, [navigate]);

    const Submit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setErrorRegistro(""); // Eliminar errores previos
        setErrorGeneral("");
        //Configurar para que no se pueda registrar si las contraseñas no coinciden
        if (contraseña !== verificarContraseña) { 
            setErrorRegistro("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/registro", {
                nombre, apellido, nickname, email, contraseña,
            });

            if (response.status === 201) { // Verificacion de status exitoso
                login(response.data.user, response.data.accessToken, response.data.refreshToken);
                navigate("/especies");
            } else {
                // En caso de errores con el servidor
                setErrorRegistro(response.data.error || "Registro fallido");
            }
        
        } catch (error: unknown) { 
            console.error("Hubo un error durante el registro:", error);

            if (axios.isAxiosError(error)) { // En caso de un error de Axios
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    // La solicitud se realizo y el servidor respondio con un codigo de fallo
                    const responseData = axiosError.response.data as RespuestaError;
                    if (responseData.error) {
                        setErrorRegistro(responseData.error);
                    } else {
                        setErrorGeneral("Error del servidor durante el registro");
                    }
                    console.error("Error del servidor:", axiosError.response.data);
                } else if (axiosError.request) {
                    // La solicitud se hizo, pero no hubo respuesta
                    console.error("Error en la solicitud:", axiosError.message);
                    setErrorGeneral("Sin respuesta del servidor");
                } else {
                    // Un fallo en la configuración de la solicitud ocasiono el error
                    console.error("Fallo en el configuracion de la solicitud:", axiosError.message);
                    setErrorGeneral("Hubo un fallo al configurar la solicitud");
                }
                } else {
                    setErrorGeneral("Un error general ha ocurrido");
                }
            }
        };
        
    return (
        <div className="d-flex vh-100 justify-content-center align-items-center">
           <div className="w-50 white-bg rounded p-3">
                <form onSubmit={Submit}>
                    <h2>Registrar Usuario</h2>
                    <div className="mb-2">
                        <label htmlFor="nombre">Nombre</label>
                        <input 
                            type="text" 
                            placeholder="Introduzca su nombre" 
                            className="form-control" 
                            id="nombre"
                            onChange={(e) => setNombre(e.target.value)}
                            autoComplete="given-name"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="apellido">Apellido</label>
                        <input 
                            type="text" 
                            placeholder="Introduzca su apellido" 
                            className="form-control" 
                            id="apellido"
                            onChange={(e) => setApellido(e.target.value)}
                            autoComplete="family-name"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="nickname">Nickname</label>
                        <input 
                            type="text" 
                            placeholder="Introduzca su nickname" 
                            className="form-control" 
                            id="nickname"
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Correo</label>
                        <input 
                            type="text" 
                            placeholder="Introduzca su correo" 
                            className="form-control" 
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type={mostrarContraseña ? "text" : "password"}
                            placeholder="Introduzca su contraseña"
                            className="form-control"
                            id="password"
                            onChange={(e) => setContraseña(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="verificarPassword">Verifique su contraseña</label>
                        <input
                            type={mostrarContraseña ? "text" : "password"}
                            placeholder="Confirme la contraseña"
                            className="form-control"
                            id="verificarPassword"
                            onChange={(e) => setVerificarContraseña(e.target.value)}
                        />
                    </div>
                    <label> {/* Opción para mostrat la contraseña */}
                        Mostrar Contraseña
                        <input
                            type="checkbox"
                            name="checkbox"
                            checked={mostrarContraseña}
                            onChange={() => setMostrarContraseña(!mostrarContraseña)}
                        />
                    </label>
                    <button className="btn">Registrarse</button>
                    {errorRegistro && <p className="mensaje-error">{errorRegistro}</p>} {/* Render condicional en caso de error */}
                    {errorGeneral && <p className="mensaje-error">{errorGeneral}</p>}
                </form>
            </div>
        </div>
    )
};

export default PaginaRegistro;