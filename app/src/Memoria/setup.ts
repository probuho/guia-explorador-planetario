import carta1 from '../img/cartas/carta_1.jpg';
import carta2 from '../img/cartas/carta_2.jpg';
import carta3 from '../img/cartas/carta_3.jpg';
import carta4 from '../img/cartas/carta_4.jpg';
import carta5 from '../img/cartas/carta_5.jpg';
import carta6 from '../img/cartas/carta_6.jpg';
import carta7 from '../img/cartas/carta_7.jpg';
import carta8 from '../img/cartas/carta_8.jpg';
import carta9 from '../img/cartas/carta_9.jpg';
import carta10 from '../img/cartas/carta_10.jpg';
// cartaback
import cartaReverso from '../img/cartas/carta_reverso.jpg';
// Importar Utils
import { shuffleArray } from './utils';
//Import interfaz de las cartas
import TipoCarta from '../compononent/interfaces/TipoCarta';

export const crearTablero = (dificultad: string): TipoCarta[] => {
  let cartas: string[] = [];
    switch (dificultad) {
        case 'facil':
            cartas = [carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8];
            break;
        case 'normal':
            cartas = [carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8, carta9];
           break;
        case 'dificil':
            cartas = [carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8, carta9, carta10];
            break;
        default:
            cartas = [carta1, carta2, carta3, carta4, carta5, carta6, carta7, carta8]; // Facil es el predeterminado
    }
  const tablero = [...cartas, ...cartas].map((carta, i) => ({
    id: `carta${i}`,
    volteada: false,
    imagenReverso: cartaReverso,
    imagenFrente: carta,
    clickable: true,
    coincidenciaCartaId: i < cartas.length ? `carta${i + cartas.length}` : `carta${i - cartas.length}`
  }));
  // Importante que no se baraje antes de que las cartas esten mapeadas
  return shuffleArray(tablero);
};