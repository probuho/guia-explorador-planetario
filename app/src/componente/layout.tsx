import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/useAuth';
import "../styles.scss";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { //Redirección y limpieza de valores al cerrar sesión
        logout();
        navigate('/');
    };

    return (
        <div>
            <header>
                <nav>
                    <Link to="/" className='link'>Especies</Link>
                    <Link to="/memoria" className='link'>Memoria</Link>
                    {auth?.user ? (
                        <>  {/* Se muestra informacion del usuario y se cierra sesion */}
                            <span>{auth.user?.nickname || auth.user?.nombre || 'Usuario'}</span>
                            <button type="button" className="btn" onClick={handleLogout}>Cerrar sesion</button>
                        </>
                    ) : (
                        <>  {/* Se inicia sesion o se registra en caso de no haber una sesion iniciada */}
                            <Link to="/iniciar-sesion" className='link'>Iniciar sesión</Link>
                            <Link to="/registro" className='link'>Registrarse</Link>
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