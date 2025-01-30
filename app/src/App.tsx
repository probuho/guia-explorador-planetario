import React from 'react';
import Carta from './compononent/cartas/Carta';
//Configuración
import { crearTablero } from './setup';
import { shuffleArray } from './utils';
//Tipos
import { TipoCarta } from './setup';
// Estilos
import { Grid } from './App.styles';

const App = () => {
  const [cartas, setCartas] = React.useState<TipoCarta[]>(shuffleArray(crearTablero()));
  const [Victoria, setVictoria] = React.useState(false);
  const [coincidenciaPares, setCoincidenciaPares] = React.useState(0);
  const [cartaSeleccionada, setCartaSeleccionada] = React.useState<undefined | TipoCarta>(undefined);
  
  React.useEffect(() => {
    if(coincidenciaPares === cartas.length / 2){
        console.log("Felicidades, has ganado la partida");
        setVictoria(true);
    }
  }, [coincidenciaPares]);
  
  const handleCartaClick = (cartaActual: TipoCarta) =>{
    //Voltear las cartas
    setCartas(prev => prev.map(carta => carta.id === cartaActual.id ? { ...carta, volteada: true, clickable: false} : carta));
    //En caso de ser la aprimera carta mantenerla volteada
    if(!cartaSeleccionada){
        setCartaSeleccionada({ ...cartaActual });
        return;
    }
    //En caso de que coincida el par
    if(cartaSeleccionada.coincidenciaCartaId === cartaActual.id){
        setCoincidenciaPares(prev => prev + 1);
        setCartas(prev =>
            prev.map(carta => 
                carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, clickable: false}: carta)
            );
        setCartaSeleccionada(undefined);
        return;
    }
    //Si no hay coincidencia en el par estas se voltean tras un segundo
    setTimeout(() => {
        setCartas(prev =>
            prev.map(carta => 
                carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, volteada: false, clickable: true}: carta)
        )
    }, 600);
    setCartaSeleccionada(undefined);
  };


  return (
    <div>
      <Grid>
        {cartas.map(carta => (
            <Carta key={carta.id} carta={carta} callback={handleCartaClick}/>
        ))

        }
      </Grid>
    </div>
  );
};

export default App;