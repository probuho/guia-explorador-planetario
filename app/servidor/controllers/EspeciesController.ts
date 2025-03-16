import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class EspeciesController{
    
//controlador para mostrar todas las especies
    getALLEspecies = async (req: Request, res: Response) => {
        try{
            const especies = await prisma?.especies.findMany();
            res.status(200).json(especies);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo recibir los datos de las especies" });
            return;
        }
    }
//controlador para mostrar una especie por id
    getEspecies = async (req: Request, res: Response) => {
        try{
            const id = String(req.params.id);

            const especies = await prisma?.especies.findUnique({
                where: { id: id }, // Uso del id de Prisma
                select: { // Selección de los campos a cargar
                    id: true,
                    nombre: true,
                    tamano: true,
                    peso: true,
                    habitat: true,
                    alimentacion: true,
                    tipo: true,
                    descripcion:true,
                },
            });
            
            if (!especies) {
                return res.status(404).json({ error: "Especie no encontrada" });
            }
            console.log(id);
            res.status(200).json(especies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo recibir los datos de la especie" });
        }
    }
//controlador para registrar una nueve especie
    createEspecies = async (req: Request, res: Response) => {
        try{
            const {nombre, tamano, peso, habitat, alimentacion, tipo, descripcion } = req.body;
            const especies = await prisma?.especies.create({
                data: { // Los datos se almacenan dentro de la propiedad data debido a como se reciben en el cliente
                    nombre,
                    tamano: Number(tamano),
                    peso: Number(peso),
                    habitat,
                    alimentacion,
                    tipo,
                    descripcion,
                },
            });
            res.status(201).json({message: "¡Especie registrada!", data: especies});
            return;
        } catch (error) {
            console.error("Error al enviar los datos de la especie:", error);
            res.status(500).json({ error: "No se pudo enviar los datos de la especie" });
            return;
        }
    }
//controlador para encontrar a la especie por id y actualizar los datos de los campos
    updateEspecies = async (req: Request, res: Response) => {
        try{
            const id = String(req.params.id);
            const { nombre, tamano, peso, habitat, alimentacion, tipo, descripcion } = req.body;
            const updatedEspecies = req.body;
            // Validar y convertir tamano y peso
            if (typeof updatedEspecies.tamano === 'string') {
                updatedEspecies.tamano = Number(updatedEspecies.tamano);
                if (isNaN(updatedEspecies.tamano)) {
                    return res.status(400).json({ error: "Valor invalido para tamaño" });
                }
            }

            if (typeof updatedEspecies.peso === 'string') {
                updatedEspecies.peso = Number(updatedEspecies.peso);
                if (isNaN(updatedEspecies.peso)) {
                    return res.status(400).json({ error: "Valor invalido para peso" });
                }
            }

            const especies = await prisma?.especies.update({
                where: { id: id },
                data: {
                    nombre: nombre !== undefined ? nombre : undefined, // Solo actualizar si se proveé un valor
                    tamano: tamano !== undefined ? Number(tamano) : undefined,
                    peso: peso !== undefined ? Number(peso) : undefined,
                    habitat: habitat !== undefined ? habitat : undefined,
                    alimentacion: alimentacion !== undefined ? alimentacion : undefined,
                    tipo: tipo !== undefined ? tipo : undefined,
                    descripcion: descripcion !== undefined ? descripcion : undefined,
                },
            }); //Actualiza y retorna el nuevo documento
            if (!especies) {
                return res.status(404).json({ error: "Especie no encontrada" });
            }
            res.status(200).json(especies);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo actualizar la especie" });
            return;
        }
    }
//controlador para encontrar a la especie por id y borrarla
    deleteEspecies = async (req: Request, res: Response) => {
        try{
            const {id} = req.params;
            await prisma?.especies.delete({
                where: { id },
            });
            res.status(200).json({message: "Especie borrada"});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo borrar los datos de la especie" });
            return;
        }
    }
};

export default new EspeciesController();