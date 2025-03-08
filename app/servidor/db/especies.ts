import mongoose from "mongoose"; 

//Se crea el esquema con los distintos campos de la base de datos
const EspeciesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    tamano: {
        type: Number,
        required: true,
    },
    peso: {
        type: Number,
        required: true,
    },
    habitat: {
        type: String,
        required: true,
    },
    alimentacion: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    }, 
    {
        timestamps: true,
    }
);

//se exporta para poder importarlo a otros archivos
export const EspeciesModel = mongoose.model("Especies", EspeciesSchema);
