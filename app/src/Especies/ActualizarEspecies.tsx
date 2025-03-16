import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, {AxiosError} from "axios";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import "../styles.scss";
//Interface
import Especie from "../componente/interfaces/Especies";
import RespuestaError from "../componente/interfaces/Error";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ActualizarEspecies = () => {
    const {id} = useParams();
    const [especie, setEspecie] = useState<Especie | null>(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        const fetchEspecie = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/especies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`
                    }
                });
                setEspecie(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError;
                    if (axiosError.response) {
                        const responseData = axiosError.response.data as RespuestaError;
                        setError(responseData.error || "Error al actualizar la especie. Por favor intente de nuevo.");
                    } else {
                        setError("Error al actualizar la especie. Por favor intente de nuevo.");
                    }
                } else {
                    setError("Error al actualizar la especie. Por favor intente de nuevo.");
                }
                console.error("Error al actualizar la especie:", err);
            } finally {
                setLoading(false)}
            };
        
        fetchEspecie();
    }, [id, auth?.token]);

    const Update = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!especie) return;

        // Creación de un nuevo objeto con los datos a actualizar
        const dataActualizada = {
            nombre: especie.nombre,
            tamano: especie.tamano,
            peso: especie.peso,
            habitat: especie.habitat,
            alimentacion: especie.alimentacion,
            tipo: especie.tipo,
            descripcion: especie.descripcion,
        };
        axios.put(`${BACKEND_URL}/especies/${id}`, dataActualizada, {
            headers: {
                Authorization: `Bearer ${auth?.token}`
            }
        })
        .then(result => {
            console.log(result)
            navigate("/")
        })
        .catch((err: unknown) => {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                if (axiosError.response) {
                    const responseData = axiosError.response.data as RespuestaError;
                    setError(responseData.error || "Error al actualizar la especie. Por favor intente de nuevo.");
                } else {
                    setError("Error al actualizar la especie. Por favor intente de nuevo.");
                }
            } else {
                setError("Error al actualizar la especie. Por favor intente de nuevo.");
            }
            console.error("Error al actualizar la especie:", err);
        });
    };
    if (loading) {
        return <div>Cargando los datos de la especie...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    if (!especie) { // Estado de carga
        return <div>Datos de especie no encontrados</div>;
    }
    return (
        <div className="d-flex vh-100 justify-content-center align-items-center">
           <div className="w-50 white-bg rounded p-3">
                <form onSubmit={Update}>
                    <h2>Actualizar Especie</h2>
                    <div className="mb-2">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" placeholder="Introduzca el nombre de la especie" className="form-control" id="nombre" 
                        value={especie.nombre || ""} onChange={(e) => setEspecie({ ...especie, nombre: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tamano">Tamaño (cm)</label>
                        <input type="number" placeholder="Introduzca el tamaño de la especie" className="form-control" id="tamano"
                        value={especie.tamano || ""} onChange={(e) => {
                            const tamano = Number(e.target.value); // Convierte el dato de string a número
                            setEspecie({ ...especie, tamano: isNaN(tamano) ? 0 : tamano });
                        }}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="peso">Peso (kg)</label>
                        <input type="number" placeholder="Introduzca el peso de la especie" className="form-control" id="peso"
                        value={especie.peso || ""} onChange={(e) => {
                            const peso = Number(e.target.value);
                            setEspecie({ ...especie, peso: isNaN(peso) ? 0 : peso });
                        }}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="habitat">Habitat</label>
                        <input type="text" placeholder="Introduzca el habitat de la especie" className="form-control" id="habitat"
                        value={especie.habitat || ""} onChange={(e) => setEspecie({ ...especie, habitat: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="alimentacion">Alimentación</label>
                        <input type="text" placeholder="Introduzca la alimentación de la especie" className="form-control" id="alimentacion"
                        value={especie.alimentacion || ""} onChange={(e) => setEspecie({ ...especie, alimentacion: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tipo">Tipo</label>
                        <input type="text" placeholder="Introduzca el tipo de la especie" className="form-control" id="tipo"
                        value={especie.tipo || ""} onChange={(e) => setEspecie({ ...especie, tipo: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" placeholder="Introduzca la descripción de la especie" className="form-control" id="descripcion"
                        value={especie.descripcion || ""} onChange={(e) => setEspecie({ ...especie, descripcion: e.target.value })}/>
                    </div>
                    <button className="btn btn-success">Actualizar</button>
                    <Link to={"/"} className="btn btn-danger">Cancelar</Link>
                </form>
                {error && <p className="mensaje-error">{error}</p>}
            </div>
        </div>
    )
};

export default ActualizarEspecies;