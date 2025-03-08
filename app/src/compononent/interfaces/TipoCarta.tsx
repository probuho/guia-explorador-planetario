// La interfaz de las cartas
interface TipoCarta {
    id: string;
    volteada: boolean;
    imagenReverso: string;
    imagenFrente: string;
    clickable: boolean;
    coincidenciaCartaId: string;
  };

export default TipoCarta;