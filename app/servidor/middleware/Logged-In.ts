import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const LoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Se recibe el token de la autorización en el header

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            // En caso de que el toquen sea valido el usuario esta logged-in
            req.user = decoded; // Si se quiere acceder a la información de usuario en otros middleware o rutas
            return res.status(400).json({message: "User is already logged in"})
        } catch (error) {
            // En caso de que el token sea invalido o halla expirado se permite el acceso a las rutas
            return next();
        }
    } else {
        return next(); // En caso de no tener token se puede acceder a las rutas (login/register)
    }
};

export default LoggedIn;