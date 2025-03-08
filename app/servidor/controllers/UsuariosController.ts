import dotenv from 'dotenv';
dotenv.config();
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const TokensInvalidos: Set<string> = new Set(); // Lista negra de tokens

class UsuariosController {
    createUsuarios = async (req: Request, res: Response) => {
        try {
            const { nombre, apellido, nickname, email, contraseña } = req.body;

            // Verificación de si el correo ya esta registrado
            const existingUser = await prisma.user.findUnique({
                where: { email: email },
            });

            if (existingUser) {
                return res.status(400).json({ error: "Ese correo ya está registrado, por favor use uno distinto." });
            }

            const hashedPassword = await bcrypt.hash(contraseña, 10);

            const newUser = await prisma.user.create({
                data: {
                    nombre,
                    apellido,
                    nickname,
                    email,
                    contraseña: hashedPassword,
                },
            });
            const user = await prisma.user.findUnique({where: {email}});
            if (!user || !await bcrypt.compare(contraseña, user.contraseña)) {
                return res.status(500).json({message: 'Credenciales invalidas'});
            }

            const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1d' }); // Generar el token JWT de corta duración
            console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
            const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Generar el token JWT de larga duración
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                accessToken,
                refreshToken, 
                user: {
                    id: user.id, 
                    nombre: user.nombre, 
                    apellido: user.apellido, 
                    nickname: user.nickname, 
                    email: user.email}});

        } catch (error) {
            console.error("Error al enviar los datos del usuario:", error);
            res.status(500).json({error: "No se pudo enviar los datos del usuario"});
        }
    };

    loginUsuario = async (req: Request, res: Response) => {
        try {
            const { email, contraseña } = req.body;

            const user = await prisma.user.findUnique({where: {email}});
            if (!user || !await bcrypt.compare(contraseña, user.contraseña)) {
                return res.status(401).json({message: 'Credenciales invalidas'});
            }

            const accessToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1d' }); // Generar el token JWT de corta duración
            console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
            const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Generar el token JWT de larga duración
            res.status(201).json({
                accessToken,
                refreshToken, 
                user: {
                id: user.id, 
                nombre: user.nombre, 
                apellido: user.apellido, 
                nickname: user.nickname, 
                email: user.email}});
        } catch (error) {
            console.error("Error al iniciar sesion:", error);
            res.status(500).json({error: "No se pudo iniciar sesion"});
        }
    };

    actualizarUsuario = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id; 
            const datosActualizados = req.body;

            const usuarioActualizado = await prisma?.user.update({
                where: { id: userId }, 
                data: datosActualizados, 
            });

            if (!usuarioActualizado) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json(usuarioActualizado);
        } catch (error) {
            console.error('Error al actualizar al usuario:', error);
            res.status(500).json({ error: 'No se pudo actualizar al usuario' });
        }
    };

    logoutUsuario = async (req: Request, res: Response) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
            //TokensInvalidos.add(token); // Agregar token a la lista negra
            res.status(204).send(); // No Content
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    };

    verificarToken = (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            console.log("Token no ofrecido");
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        if (TokensInvalidos.has(token)) {
            console.log("Token está en la lista negra:", token);
            return res.status(401).json({ error: 'Token inválido' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado', decoded);
            console.log('Tiempo actual', new Date());
            next();
        } catch (error) {
            console.log("Verificación de token fallida:", error);
            return res.status(401).json({ error: 'Token inválido' });
        }
    };

    refrescarToken = async (req: Request, res: Response) => {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Token de refresco no proporcionado' });
        }
    
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ accessToken });
        } catch (error) {
            return res.status(401).json({ error: 'Token de refresco inválido' });
        }
    };
}

export default new UsuariosController();
