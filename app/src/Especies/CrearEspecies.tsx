import React, { useState } from "react";
import axios, {AxiosError} from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import RespuestaError from "../componente/interfaces/Error";
import "../styles.scss";

const CrearEspecies = () => {
    const [nombre, setNombre] = useState<unknown | null>(null);
    const [tamano, setTamano] = useState<unknown | null>(null);
    const [peso, setPeso] = useState<unknown | null>(null);
    const [habitat, setHabitat] = useState<unknown | null>(null);
    const [alimentacion, setAlimentacion] = useState<unknown | null>(null);
    const [tipo, setTipo] = useState<unknown | null>(null);
    const [descripcion, setDescripcion] = useState<unknown | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { auth } = useAuth();

    const Submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        axios.post("http://localhost:4000/especies", {nombre, tamano, peso, habitat, alimentacion, tipo, descripcion }, {
            headers: {
                Authorization: `Bearer ${auth?.token}` 
            }
        })
        .then(result => {
            console.log(result)
            navigate("/especies")
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        const responseData = axiosError.response.data as RespuestaError;
                        setError(responseData.error || "Error al registrar la especie");
                    } else {
                        setError("Error al registrar la especie");
                    }
                } else {
                    setError("Error al registrar la especie");
                }
                console.error("Error al registrar la especie:", error);
            });
    };
    return (
        <div className="d-flex vh-100 justify-content-center align-items-center">
           <div className="w-50 white-bg rounded p-3">
                <form onSubmit={Submit}>
                    <h2>Agregar Especie</h2>
                    <div className="mb-2">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" placeholder="Introduzca el nombre de la especie" className="form-control" id="nombre"
                        onChange={(e) => setNombre(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tamano">Tamaño (cm)</label>
                        <input type="text" placeholder="Introduzca el tamaño de la especie" className="form-control" id="tamano"
                        onChange={(e) => setTamano(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="peso">Peso (kg)</label>
                        <input type="text" placeholder="Introduzca el peso de la especie" className="form-control" id="peso"
                        onChange={(e) => setPeso(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="habitat">Habitat</label>
                        <input type="text" placeholder="Introduzca el habitat de la especie" className="form-control" id="habitat"
                        onChange={(e) => setHabitat(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="alimentacion">Alimentación</label>
                        <input type="text" placeholder="Introduzca la alimentación de la especie" className="form-control" id="alimentacion" 
                        onChange={(e) => setAlimentacion(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tipo">Tipo</label>
                        <input type="text" placeholder="Introduzca el tipo de la especie" className="form-control" id="tipo"
                        onChange={(e) => setTipo(e.target.value)}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" placeholder="Introduzca la descripción de la especie" className="form-control" id="descripcion"
                        onChange={(e) => setDescripcion(e.target.value)}/>
                    </div>
                    <button className="btn btn-success">Registrar</button>
                    <Link to={"/especies"} className="btn btn-danger">Cancelar</Link>
                    {error && <p className="mensaje-error">{error}</p>}
                </form>
            </div>
        </div>
    )
};

export default CrearEspecies;