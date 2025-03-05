import React, { useEffect, useState, useCallback } from "react";
import Carta from '../component/cartas/Carta'; // Corregido de './component/cartas/Carta' a '../component/cartas/Carta'
import { crearTablero } from './setup'; // Corregido de './setup' a '../setup'
import TipoCarta from "../component/interfaces/TipoCarta"; // Corregido de './component/interfaces/TipoCarta' a '../component/interfaces/TipoCarta'
import {
  MemoriaContainer,
  GameHeader,
  GameControls,
  GameStats,
  StatCard,
  DifficultySelect,
  NewGameButton,
  GameGrid
} from './Memoria.styles';
import NavBar from "../component/NavBar"; // Importar el componente NavBar

const Memoria = () => {
  const [dificultad, setDificultad] = useState('facil');
  const [cartas, setCartas] = useState<TipoCarta[]>([]);
  const [coincidenciaPares, setCoincidenciaPares] = useState(0);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<undefined | TipoCarta>(undefined);
  const [tiempoLimite, setTiempoLimite] = useState(60);
  const [movimientosLimite, setMovimientosLimite] = useState(40);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoLimite);
  const [movimientosRestantes, setMovimientosRestantes] = useState(movimientosLimite);
  const [puntuacion, setPuntuacion] = useState(0);
  const [puntuacionTotal, setPuntuacionTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [, setVictoria] = useState(false);

  const resetGame = useCallback(() => {
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
    resetGame();
  }, [dificultad, resetGame]);

  useEffect(() => {
    let reloj: ReturnType<typeof setInterval>;
    if (!gameOver && tiempoRestante > 0) {
      reloj = setInterval(() => {
        setTiempoRestante(prevTiempo => prevTiempo - 1);
      }, 1000);
    } else if (tiempoRestante === 0 && !gameOver) {
      setGameOver(true);
    }
    return () => clearInterval(reloj);
  }, [gameOver, tiempoRestante]);

  useEffect(() => {
    if (gameOver) {
      setPuntuacionTotal(prevPuntuacion => prevPuntuacion + puntuacion);
    }
  }, [gameOver, puntuacion]);

  useEffect(() => {
    if (cartas.length > 0 && coincidenciaPares === cartas.length / 2 && !gameOver) {
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
      const puntuacionPartida = tiempoRestante * movimientosRestantes * multiplicador;
      setPuntuacion(puntuacionPartida);
      setGameOver(true);
      setVictoria(true);
    }
  }, [cartas.length, coincidenciaPares, dificultad, tiempoRestante, movimientosRestantes, gameOver]);

  const handleCartaClick = (cartaActual: TipoCarta) => {
    if (gameOver) {
      return;
    }
    setCartas(prev => prev.map(carta => carta.id === cartaActual.id ? { ...carta, volteada: true, clickable: false } : carta));
    if (!cartaSeleccionada) {
      setCartaSeleccionada({ ...cartaActual });
      return;
    }
    if (cartaSeleccionada.coincidenciaCartaId === cartaActual.id) {
      setCoincidenciaPares(prev => prev + 1);
      setCartas(prev =>
        prev.map(carta =>
          carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, clickable: false } : carta)
      );
      setCartaSeleccionada(undefined);
      return;
    }
    setTimeout(() => {
      setCartas(prev =>
        prev.map(carta =>
          carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, volteada: false, clickable: true } : carta)
      );
    }, 600);
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
    <MemoriaContainer>
      <NavBar /> {/* Agregar el componente NavBar */}
      <GameHeader>
        <GameControls>
          <DifficultySelect 
            value={dificultad} 
            onChange={e => setDificultad(e.target.value)}
          >
            <option value="facil">Fácil</option>
            <option value="normal">Normal</option>
            <option value="dificil">Difícil</option>
          </DifficultySelect>
          {gameOver && (
            <NewGameButton onClick={handleNewGame}>
              Nueva Partida
            </NewGameButton>
          )}
        </GameControls>
      </GameHeader>

      <GameStats>
        <StatCard>
          <h3>Tiempo Restante</h3>
          <p>{tiempoRestante}s</p>
        </StatCard>
        <StatCard>
          <h3>Movimientos Restantes</h3>
          <p>{movimientosRestantes}</p>
        </StatCard>
        <StatCard>
          <h3>Puntuación Actual</h3>
          <p>{puntuacion}</p>
        </StatCard>
        <StatCard>
          <h3>Puntuación Total</h3>
          <p>{puntuacionTotal}</p>
        </StatCard>
      </GameStats>

      <GameGrid>
        {cartas.map(carta => (
          <Carta 
            key={carta.id} 
            carta={carta} 
            callback={handleCartaClick} 
          />
        ))}
      </GameGrid>
    </MemoriaContainer>
  );
};

export default Memoria;