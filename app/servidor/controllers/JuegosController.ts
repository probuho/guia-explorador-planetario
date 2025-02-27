import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
class PuntuacionController{
    createOrUpdatePuntuacion = async (req: Request, res: Response) => {
        try {
            const { userId, puntuacion } = req.body;
            const puntuacionNumber = parseInt(puntuacion); // Diseccionar a numero

            // Buscar si ya existe un registro
            const existingPuntuacion = await prisma.puntuacion.findFirst({
                where: { userId: userId },
            });

            if (existingPuntuacion) {
                // Actualizar registro existente
                const existingScore = existingPuntuacion.puntuacion || "0";
                const updatedPuntuacion = await prisma.puntuacion.update({
                    where: { id: existingPuntuacion.id },
                    data: {
                        puntuacion: (parseInt(existingScore) + puntuacionNumber).toString(), // Agrega y convertir a string
                    },
                });
                return res.status(200).json({ message: "Puntuacion actualizada", data: updatedPuntuacion });
            } else {
                // Crear un nuevo registro
                const newPuntuacion = await prisma.puntuacion.create({
                    data: {
                        userId,
                        puntuacion: puntuacion.toString(),
                    },
                });
                return res.status(201).json({ message: "Puntuacion creada", data: newPuntuacion });
            }
        } catch (error) {
            console.error("Error al crear/actualizar puntuacion:", error);
            res.status(500).json({ error: "No se pudo crear/actualizar la puntuacion" });
        }
    };

    getUserPuntuacion = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId; // Obtener el userId de los params

            const puntuaciones = await prisma.puntuacion.findMany({ 
                where: { userId: userId }, 
                select: {
                    puntuacion: true,
                },
            });

            if (!puntuaciones) {
                return res.status(404).json({ error: "Puntuacion no encontrada" });
            }

            res.status(200).json(puntuaciones);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo recibir los datos de la puntuacion" });
        }
    };
}

export default new PuntuacionController();
