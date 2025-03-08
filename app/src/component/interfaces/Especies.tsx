//La interfaz de las especies
interface Especie {
    _id: string; // Include the _id!
    nombre: string;
    tamano: number; // Or string, depending on your data type
    peso: number; // Or string
    habitat: string;
    alimentacion: string;
    tipo: string;
    descripcion: string;
    createdAt?: string; // Optional properties
    updatedAt?: string;
    __v?: number;
}

export default Especie;