import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Asegúrate de crear este archivo para los estilos

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <h1>Explorador Planetario</h1>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`nav-menu ${isOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={toggleMenu}>Inicio</Link>
          </li>
          <li>
            <Link to="/foro" onClick={toggleMenu}>Foro/Wiki</Link>
          </li>
          <li>
            <Link to="/identificacion" onClick={toggleMenu}>Identificación</Link>
          </li>
          <li>
            <Link to="/especies" onClick={toggleMenu}>Catálogo de Especies</Link>
          </li>
          <li>
            <Link to="/memoria" onClick={toggleMenu}>Juego de Memoria</Link>
          </li>
          <li>
            <Link to="/login" className="login-btn" onClick={toggleMenu}>Iniciar Sesión</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;