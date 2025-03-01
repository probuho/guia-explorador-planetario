import React from 'react';
import {BrowserRouter, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import useAuth from './context/useAuth.tsx';
// Rutas
import Layout from './compononent/layout.tsx';
import Especies from './Especies/Especies';
import Memoria from './Memoria/Memoria';
import ActualizarEspecies from './Especies/ActualizarEspecies';
import CrearEspecies from './Especies/CrearEspecies';
import PaginaLogin from './Usuarios/login.tsx';
import PaginaRegistro from './Usuarios/registro.tsx';

const RutasProtegidas = () => { //Configuración de acceso de rutas con la sesión iniciada
  const { loggedIn } = useAuth(); 

  return loggedIn ? <Outlet /> : <Navigate to="/iniciar-sesion" />;
};

const App = () => {
  
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/Especies' element={<Layout><Especies /></Layout>}></Route>
              <Route path="/iniciar-sesion" element={<Layout><PaginaLogin /></Layout>} />
              <Route path="/registro" element={<Layout><PaginaRegistro /></Layout>} />
              <Route path='/memoria' element={<Layout><Memoria /></Layout>}></Route>
              {/* Rutas que requieren de tener la sesión iniciada para acceder */}
              <Route element={<RutasProtegidas />}>
                <Route path='/crear' element={<Layout><CrearEspecies /></Layout>}></Route>
                <Route path='/actualizar/:id' element={<Layout><ActualizarEspecies /></Layout>}>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;

