import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
// Estilos
import Especies from './Especies/Especies';
import Memoria from './Memoria/Memoria';
import ActualizarEspecies from './Especies/ActualizarEspecies';
import CrearEspecies from './Especies/CrearEspecies';

const App = () => {
  //const [count, setCount] = useState(0);
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Memoria />}></Route>
          <Route path='/especies' element={<Especies />}></Route>
          <Route path='/crear' element={<CrearEspecies />}></Route>
          <Route path='/actualizar/:id' element={<ActualizarEspecies />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;