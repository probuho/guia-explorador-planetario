import React, { useEffect, useState, useCallback } from "react";
import Carta from '../compononent/cartas/Carta';
//Configuración
import { crearTablero } from './setup';
//Tipos
import TipoCarta from "../compononent/interfaces/TipoCarta";
// Estilos
import { Grid } from '../App.styles';

const Memoria = () => {
  const [dificultad, setDificultad] = useState('facil'); // Dificultad predeterminada
  const [cartas, setCartas] = useState<TipoCarta[]>([]);
  const [coincidenciaPares, setCoincidenciaPares] = useState(0); //Control de pares
  const [cartaSeleccionada, setCartaSeleccionada] = useState<undefined | TipoCarta>(undefined); //Control de carta seleccionada
  const [tiempoLimite, setTiempoLimite] = useState(60); // Tiempo limite inicial
  const [movimientosLimite, setMovimientosLimite] = useState(40); // Limite de movimientos iniciales
  const [tiempoRestante, setTiempoRestante] = useState(tiempoLimite); //Contador de tiempo restante
  const [movimientosRestantes, setMovimientosRestantes] = useState(movimientosLimite); //Contador de movimientos restantes
  const [puntuacion, setPuntuacion] = useState(0); //Puntuacion
  const [puntuacionTotal, setPuntuacionTotal] = useState(0); //Puntuación total entre partidas
  const [gameOver, setGameOver] = useState(false); //Finalizo la partida
  const [, setVictoria] = useState(false); //Victoria
  
  const resetGame = useCallback(() => { //Determinar las condiciones de las dificultades e inicio de juego
    setCartas(crearTablero(dificultad));
        switch (dificultad) {
            case 'facil':
                setTiempoLimite(60);
                setMovimientosLimite(40);
                break;
            case 'normal':
                setTiempoLimite(40);
                setMovimientosLimite(25);
                break;
            case 'dificil':
                setTiempoLimite(20);
                setMovimientosLimite(15);
                break;
            default:
                setTiempoLimite(60);
                setMovimientosLimite(40);
        }
        setCoincidenciaPares(0);
        setTiempoRestante(tiempoLimite);
        setMovimientosRestantes(movimientosLimite);
        setPuntuacion(0);
        setGameOver(false);
        setVictoria(false);
  }, [dificultad, tiempoLimite, movimientosLimite]);

  useEffect(() => {
    resetGame(); // Call resetGame when difficulty changes
  }, [dificultad, resetGame]); // Correct dependencies

  useEffect(() => { //Determinar el fin del juego y la puntuacion
      if (cartas.length > 0 && coincidenciaPares === cartas.length / 2  && !gameOver) {
          console.log("Felicidades, has ganado la partida");
          setVictoria(true);
          setGameOver(true);
          let multiplicador = 1;
          switch (dificultad) {
              case 'facil':
                  multiplicador = 1;
                  break;
              case 'normal':
                  multiplicador = 2;
                  break;
              case 'dificil':
                  multiplicador = 5;
                  break;
          }
          const puntuacionPartida = tiempoRestante * movimientosRestantes * multiplicador; //La puntuacion de cada partida
          setPuntuacion(puntuacionPartida);
          setGameOver(true);
          setVictoria(true);
      }
  }, [cartas.length, coincidenciaPares, dificultad, tiempoRestante, movimientosRestantes, gameOver]);

  useEffect(() => { //Determinar el tiempo limite y el final de partida al acabarse
    let reloj: ReturnType<typeof setInterval>;
    if (!gameOver && tiempoRestante > 0) {
        reloj = setInterval(() => {
            setTiempoRestante(prevTiempo => prevTiempo - 1);
        }, 1000);
    } else if (tiempoRestante === 0  && !gameOver) {
        setGameOver(true);
    }
    return () => clearInterval(reloj);
  }, [gameOver, tiempoRestante]);

  useEffect(() => { // Actualizacion de puntuacion total
    if (gameOver) { // Solo se ejecuta cuando la partida ha terminado
        setPuntuacionTotal(prevPuntuacion => prevPuntuacion + puntuacion);
    }
  }, [gameOver, puntuacion]);
  
  const handleCartaClick = (cartaActual: TipoCarta) =>{ //Logica del juego en si
    //Logica para prevenir más clicks si la partida acabo
    if (gameOver) {  // Prevent clicks if game is over
      return;
    }
    //Voltear las cartas
    setCartas(prev => prev.map(carta => carta.id === cartaActual.id ? { ...carta, volteada: true, clickable: false} : carta));
    //En caso de ser la primera carta mantenerla volteada
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
    //Si no hay más movimientos
    if (movimientosRestantes === 0 && !cartaActual.volteada) {
      return;
    }
    if (!cartaActual.volteada) {
        setMovimientosRestantes(prevMovimientos => prevMovimientos - 1);
    }
    setCartaSeleccionada(undefined);
  };

  const handleNewGame = () => {
    resetGame();
  };


  return (
    <div>
      <div>
        <label htmlFor="dificultad">Dificultad:</label>
        <select id="dificultad" value={dificultad} onChange={e => setDificultad(e.target.value)}>
          <option value="facil">Fácil</option>
          <option value="normal">Normal</option>
          <option value="dificil">Difícil</option>
        </select>
      </div>
        <div>Tiempo Restante: {tiempoRestante}</div>
        <div>Movimientos Restantes: {movimientosRestantes}</div>
        <div>Puntuación: {puntuacion}</div>
        <div>Puntuación Total: {puntuacionTotal}</div>
          {gameOver && (
            <button onClick={handleNewGame} disabled={!gameOver}>Nueva Partida</button>
          )}
        <Grid>
          {cartas.map(carta => (
            <Carta key={carta.id} carta={carta} callback={handleCartaClick} />
          ))}
        </Grid>
    </div>
  );
};

export default Memoria;