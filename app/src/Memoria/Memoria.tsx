import React, { useEffect, useState, useCallback } from "react";
import Carta from "../componente/cartas/Carta";
import axios, {AxiosError} from "axios";
import Usuario from "../componente/interfaces/Usuario";
import RespuestaError from "../componente/interfaces/Error";
import useAuth from "../context/useAuth";
//Configuracion
import { crearTablero } from "./setup";
//Tipos
import TipoCarta from "../componente/interfaces/TipoCarta";
// Estilos
import { Grid } from "../App.styles";
import "../styles.scss";

const Memoria = () => {
  const [dificultad, setDificultad] = useState('facil'); // Dificultad predeterminada
  const [cartas, setCartas] = useState<TipoCarta[]>([]);
  const [coincidenciaPares, setCoincidenciaPares] = useState(0); //Control de pares
  const [cartaSeleccionada, setCartaSeleccionada] = useState<undefined | TipoCarta>(undefined); //Control de carta seleccionada
  const [tiempoLimite, setTiempoLimite] = useState(60); // Tiempo limite inicial
  const [movimientosLimite, setMovimientosLimite] = useState(40); // Limite de movimientos iniciales
  const [tiempoRestante, setTiempoRestante] = useState(tiempoLimite); //Contador de tiempo restante
  const [movimientosRestantes, setMovimientosRestantes] = useState(movimientosLimite); //Contador de movimientos restantes
  const [puntuacion, setPuntuacion] = useState(0); //Puntuacion de la partida actual
  const [user, setUser] = useState<Usuario | null>(null); //Usuario
  const [puntuacionTotal, setPuntuacionTotal] = useState(0); //Puntuacion total entre partidas
  const [gameOver, setGameOver] = useState(false); //Finalizo la partida
  const [volteada, setVolteada] = useState(false); //Estado para la animación de volteada
  const [error, setError] = useState<string | null>(null); //Errores
  const [, setVictoria] = useState(false); //Victoria
  const { auth } = useAuth(); //Datos del usuario

  useEffect(() => {
    if (auth?.user) { // Se usan los datos del usuario en el contexto
      setUser(auth.user);
      console.log("Datos de usuario traidos del contexto:", auth.user);
  }
}, [auth]);
  
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
                setTiempoLimite(30);
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
    const fetchPuntuacionTotal = async () => {
        if (auth?.user && auth?.token) { //Verificaión de si existe token de usuario
          console.log("Fetching la puntuación del usuario:", auth.user);
          try {
                const response = await axios.get(`http://localhost:4000/memoria/${auth.user.id}`, {
                  headers: {
                      Authorization: `Bearer ${auth.token}` // Incluye el token en el header
                  }
                });
                setPuntuacionTotal(response.data.reduce((sum: number, puntuacion: { puntuacion: string }) => sum + parseInt(puntuacion.puntuacion), 0));
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        const responseData = axiosError.response.data as RespuestaError;
                        setError(responseData.error || "Error al traer la puntuación total");
                    } else {
                        setError("Error al traer la puntuación total");
                    }
                } else {
                    setError("Error al traer la puntuación total");
                }
              console.error("Error al traer la puntuación total:", error);
              setPuntuacionTotal(0);
            }
        }
    };

    fetchPuntuacionTotal(); 
  }, [auth]);

  useEffect(() => {
    if (gameOver && auth?.user && auth?.token) {
        const saveScore = async () => {
            try {
                await axios.post(`http://localhost:4000/memoria`, { 
                  userId: auth.user.id,
                  puntuacion: puntuacion.toString()
              }, {
                headers: {
                    Authorization: `Bearer ${auth.token}` // Incluye el token en el header
                }
              });
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        const responseData = axiosError.response.data as RespuestaError;
                        setError(responseData.error || "Error al almacenar la puntuación");
                    } else {
                        setError("Error al almacenar la puntuación");
                    }
                } else {
                    setError("Error al almacenar la puntuación");
                }
              console.error("Error al almacenar la puntuación:", error);
            }
        };
        saveScore();
    }
  }, [gameOver, puntuacion, auth]);

  useEffect(() => {
    resetGame(); // resetGame ocurre cuando se cambia de dificultad
  }, [dificultad, resetGame]); 

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

  useEffect(() => { // Actualización de puntuación total
    if (gameOver) { // Solo se ejecuta cuando la partida ha terminado
        setPuntuacionTotal(prevPuntuacion => prevPuntuacion + puntuacion);
    }
  }, [gameOver, puntuacion]);
  
  const handleCartaClick = (cartaActual: TipoCarta) =>{ //Logica del juego en si
    //Logica para prevenir más clicks si la partida acabo
    if (gameOver || volteada) {  // Prevenir mas clicks si la partida termino
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
      console.log("Coincidencia encontrada:", cartaSeleccionada, cartaActual)
        setCoincidenciaPares(prev => prev + 1);
        setCartas(prev =>
            prev.map(carta => 
                carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, clickable: false}: carta)
            );
        setCartaSeleccionada(undefined);
        if (user && gameOver) { // Actualizar la puntuación total en la base de datos cada vez que se encuentra un par
          console.log("Fetching la puntuación del usuario:", user);
          const updatePuntuacionTotal = async () => { 
              try {
                await axios.post(`http://localhost:4000/memoria`, {
                  userId: user.id,
                  puntuacion: puntuacion.toString()
                });
                const response2 = await axios.get(`http://localhost:4000/memoria/${user.id}`);
                setPuntuacionTotal(response2.data.reduce((sum: number, puntuacion: { puntuacion: string }) => sum + parseInt(puntuacion.puntuacion), 0));
              } catch (error: unknown) {
                  if (axios.isAxiosError(error)) {
                      const axiosError = error as AxiosError;
                      if (axiosError.response) {
                          const responseData = axiosError.response.data as RespuestaError;
                          setError(responseData.error || "Error al actualizar la puntuación total");
                      } else {
                          setError("Error al actualizar la puntuación total");
                      }
                  } else {
                      setError("Error al actualizar la puntuación total");
                  }
                  console.error("Error al actualizar la puntuación total:", error);
              }
          };
          updatePuntuacionTotal();
        }
        return;
    }
    setVolteada(true); // Bloquear clicks mientras se voltean las cartas
    //Si no hay coincidencia en el par estas se voltean tras un momento
    setTimeout(() => {
      setCartas(prev =>
          prev.map(carta => 
              carta.id === cartaSeleccionada.id || carta.id === cartaActual.id ? { ...carta, volteada: false, clickable: true}: carta)
      )
      setCartaSeleccionada(undefined);
      setVolteada(false); // Permitir clics nuevamente
    }, 600);

    //Si no hay más movimientos
    if (movimientosRestantes === 0 && !cartaActual.volteada) {
      return;
    }
    if (!cartaActual.volteada) {
        setMovimientosRestantes(prevMovimientos => prevMovimientos - 1);
    }
    setCartaSeleccionada(undefined);

  }

  const handleNewGame = () => {
    resetGame();
        //Refetching la puntuación.
        const fetchPuntuacionTotal = async () => {
            if (auth?.user && auth?.token) {
                console.log("Fetching la puntuación del usuario:", auth.user);
                try {
                    const response = await axios.get(`http://localhost:4000/memoria/${auth.user.id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    setPuntuacionTotal(response.data.reduce((sum: number, puntuacion: { puntuacion: string }) => sum + parseInt(puntuacion.puntuacion), 0));
                } catch (error: unknown) {
                  if (axios.isAxiosError(error)) {
                      const axiosError = error as AxiosError;
                      if (axiosError.response) {
                          const responseData = axiosError.response.data as RespuestaError;
                          setError(responseData.error || "Error al traer la puntuación total");
                      } else {
                          setError("Error al traer la puntuación total");
                      }
                  } else {
                      setError("Error al traer la puntuación total");
                  }
                  console.error("Error al traer la puntuación total:", error);
                }
            }
        };
      fetchPuntuacionTotal();
  };


    return (
      <div className="primary-bg p-3">
        <div className="white-bg rounded p-3 mb-3">
          <div className="mb-3">
            <label htmlFor="dificultad">Dificultad:</label>
            <select id="dificultad" value={dificultad} onChange={e => setDificultad(e.target.value)}>
              <option value="facil">Fácil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
          <div>Tiempo Restante: {tiempoRestante}</div>
          <div>Movimientos Restantes: {movimientosRestantes}</div>
          <div>Puntuacion: {puntuacion}</div>
          <div>Puntuacion Total: {puntuacionTotal}</div>
        </div>
            {gameOver && (
              <button onClick={handleNewGame} disabled={!gameOver} className="btn mb-3">Nueva Partida</button>
            )}
            {error && <p className="mensaje-error">{error}</p>}
          <Grid>
            {cartas.map(carta => (
              <Carta key={carta.id} carta={carta} callback={handleCartaClick} />
            ))}
          </Grid>
      </div>
    );
};


export default Memoria;