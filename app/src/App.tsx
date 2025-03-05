import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Estilos
import Home from "./Home";
import Especies from "./Especies/Especies";
import Memoria from "./Memoria/Memoria";
import ActualizarEspecies from "./Especies/ActualizarEspecies";
import CrearEspecies from "./Especies/CrearEspecies";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/especies" element={<Especies />} />
        <Route path="/crear" element={<CrearEspecies />} />
        <Route path="/actualizar/:id" element={<ActualizarEspecies />} />
        <Route path="/memoria" element={<Memoria />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
