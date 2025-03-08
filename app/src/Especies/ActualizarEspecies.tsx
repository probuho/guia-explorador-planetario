import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
//Interface
import Especie from "../compononent/interfaces/Especies";

const ActualizarEspecies = () => {
    const {id} = useParams();
    const [especie, setEspecie] = useState<Especie | null>(null);
    const navigate = useNavigate();

    useEffect(() => {;
        axios.get("http://localhost:4000/especies/"+id)
        .then(result => {
            console.log("Data recibida:", result.data);
            setEspecie(result.data);
        })
        .catch(err => 
            console.error(err)
        );
    }, [id]);
    const Update = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!especie) return;
        axios.put("http://localhost:4000/especies/"+id, especie)
        .then(result => {
            console.log(result)
            navigate("/especies")
            })
        .catch(err => console.log(err));
    };
    if (!especie) { // Estado de carga
        return <div>Cargando los datos de las especies...</div>;
    }
    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
           <div className="w-50 bg-white rounded p-3">
                <form onSubmit={Update}>
                    <h2>Actualizar Especie</h2>
                    <div className="mb-2">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" placeholder="Introduzca el nombre de la especie" className="form-control" id="nombre" 
                        value={especie.nombre} onChange={(e) => setEspecie({ ...especie, nombre: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tamano">Tamaño</label>
                        <input type="number" placeholder="Introduzca el tamaño de la especie" className="form-control" id="tamano"
                        value={especie.tamano} onChange={(e) => {
                            const tamano = Number(e.target.value); // Convierte el dato de string a numero
                            setEspecie({ ...especie, tamano: isNaN(tamano) ? 0 : tamano });
                        }}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="peso">Peso</label>
                        <input type="number" placeholder="Introduzca el peso de la especie" className="form-control" id="peso"
                        value={especie.peso} onChange={(e) => {
                            const peso = Number(e.target.value);
                            setEspecie({ ...especie, peso: isNaN(peso) ? 0 : peso });
                        }}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="habitat">Habitat</label>
                        <input type="text" placeholder="Introduzca el habitat de la especie" className="form-control" id="habitat"
                        value={especie.habitat} onChange={(e) => setEspecie({ ...especie, habitat: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="alimentacion">Alimentación</label>
                        <input type="text" placeholder="Introduzca la alimentación de la especie" className="form-control" id="alimentacion"
                        value={especie.alimentacion} onChange={(e) => setEspecie({ ...especie, alimentacion: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tipo">Tipo</label>
                        <input type="text" placeholder="Introduzca el tipo de la especie" className="form-control" id="tipo"
                        value={especie.tipo} onChange={(e) => setEspecie({ ...especie, tipo: e.target.value })}/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" placeholder="Introduzca la descripción de la especie" className="form-control" id="descripcion"
                        value={especie.descripcion} onChange={(e) => setEspecie({ ...especie, descripcion: e.target.value })}/>
                    </div>
                    <button className="btn btn-success">Actualizar</button>
                </form>
            </div>
        </div>
    )
};

export default ActualizarEspecies;