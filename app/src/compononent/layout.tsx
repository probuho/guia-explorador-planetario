import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { loggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { //Redirección y limpieza de valores al cerrar sesión
        logout();
        navigate('/');
    };

    return (
        <div>
            <header>
                <nav>
                    <Link to="/">Especies</Link>
                    <Link to="/memoria">Memoria</Link>
                    {loggedIn ? (
                        <>  {/* Se muestra informacion del usuario y se cierra sesion */}
                            <span>{user?.nickname || user?.nombre || 'User'}</span>
                            <button type="button" className="btn btn-outline-info btn-sm" onClick={handleLogout}>Cerrar sesion</button>
                        </>
                    ) : (
                        <>  {/* Se inicia sesion o se registra en caso de no haber una sesion iniciada */}
                            <Link to="/iniciar-sesion">Iniciar sesión</Link>
                            <Link to="/registro">Registrarse</Link>
                        </>
                    )}
                </nav>
            </header>
            <main>{children}</main>
            <footer>{/* El contenido del footer */}</footer>
        </div>
    );
};

export default Layout;