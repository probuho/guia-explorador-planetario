import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//Interface
import Especie from "../compononent/interfaces/Especies";

function Especies () {
    const [especies, setEspecies] = useState<Especie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:4000/especies")
        .then((result) => {
            setEspecies(result.data);
            setLoading(false);})
        .catch(err => {
            console.error("Error al recibir las especies:", err);
            setError("La carga de datos de las especies fallo.");
            setLoading(false);
        });
    }, []);
    if (loading) {
        return <div>Cargando los datos de las especies...</div>; // Mensaje de carga
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
      if (!especies) { // En caso de que no se puedan cargar los datos (por un error de la API)
          return <div>No se encontraron datos de las especies.</div>
      }
    
    const handleDelete = (id) => {
        axios.delete("http://localhost:4000/especies/"+id)
        .then(result => {
            console.log(result);
            setEspecies(especies.filter(especie => especie._id !== id));
        })
        .catch(err => 
            console.error(err)
        );
    }
    
    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
           <div className="bg-white rounded p-3">
                <Link to={"/crear"} className="btn btn-success">Añadir</Link>
                <table className="table">
                    <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tamaño</th>
                                <th>Peso</th>
                                <th>Habitat</th>
                                <th>Alimentación</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Acción</th>
                            </tr>
                    </thead>
                    <tbody>
                        {especies.length === 0 ? ( // Verificación de si el arraw está vacio (estado inicial o sin data)
                                <tr><td colSpan={8}>No hay datos de especies disponibles en este momento.</td></tr>
                            ) : (
                            especies.map((especie) => (
                                <tr key={especie._id}>
                                <td>{especie.nombre}</td>
                                <td>{especie.tamano}</td>
                                <td>{especie.peso}</td>
                                <td>{especie.habitat}</td>
                                <td>{especie.alimentacion}</td>
                                <td>{especie.tipo}</td>
                                <td>{especie.descripcion}</td>
                                <td>
                                    <Link to={`/actualizar/${especie._id}`} className="btn btn-success">
                                    Actualizar
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleDelete(especie._id)}>Eliminar</button>
                                </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Especies;