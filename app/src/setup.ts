import carta1 from './img/cartas/carta_1.jpg';
import carta2 from './img/cartas/carta_2.jpg';
import carta3 from './img/cartas/carta_3.jpg';
import carta4 from './img/cartas/carta_4.jpg';
import carta5 from './img/cartas/carta_5.jpg';
import carta6 from './img/cartas/carta_6.jpg';
import carta7 from './img/cartas/carta_7.jpg';
import carta8 from './img/cartas/carta_8.jpg';
// cartaback
import cartaReverso from './img/cartas/carta_reverso.jpg';

// Importar Utils
import { shuffleArray } from './utils';

// La interfaz de las cartas
export type TipoCarta = {
  id: string;
  volteada: boolean;
  imagenReverso: string;
  imagenFrente: string;
  clickable: boolean;
  coincidenciaCartaId: string;
};

// Crear un array con las cartas
const cartas: string[] = [carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8];

export const crearTablero = (): TipoCarta[] => {
  const tablero = [...cartas, ...cartas].map((carta, i) => ({
    id: `carta${i}`,
    volteada: false,
    imagenReverso: cartaReverso,
    imagenFrente: carta,
    clickable: true,
    coincidenciaCartaId: i < cartas.length ? `carta${i + cartas.length}` : `carta${i - cartas.length}`
  }));
  // Important to not shuffle the array before the mapping has been done
  return shuffleArray(tablero);
};