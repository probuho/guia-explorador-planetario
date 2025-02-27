import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generar el JWT
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token, 
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

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({token, user: {
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
}

export default new UsuariosController();
