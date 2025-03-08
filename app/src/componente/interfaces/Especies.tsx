//La interfaz de las especies
interface Especie {
    id: string; 
    nombre: string;
    tamano: number; 
    peso: number; 
    habitat: string;
    alimentacion: string;
    tipo: string;
    descripcion: string;
    /* createdAt?: string; En caso de que se terminen agregando a la base de datos estos campos
    updatedAt?: string;
    __v?: number; */
}

export default Especie;