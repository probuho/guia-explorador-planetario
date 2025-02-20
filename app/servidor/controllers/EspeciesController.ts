import express from "express";
import { EspeciesModel } from "../db/especies";
class EspeciesController{
    
//controlador para mostrar todas las especies
    getALLEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const especies = await EspeciesModel.find();
            response.status(200).json(especies);
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "No se pudo recibir los datos de las especies" });
            return;
        }
    }
//controlador para mostrar una especie por id
    getEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id} = request.params;
            const especies = await EspeciesModel.findById(id);
            if (!especies) {
                return response.status(404).json({ error: "Especie no encontrada" });
            }
            response.status(200).json(especies);
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "No se pudo recibir los datos de la especie" });
            return;
        }
    }
//controlador para registrar una nueve especie
    createEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {nombre, tamano, peso, habitat, alimentacion, tipo, descripcion } = request.body;
            const especies = new EspeciesModel({
                nombre,
                tamano,
                peso,
                habitat,
                alimentacion,
                tipo,
                descripcion
            });
            await especies.save();
            response.status(201).json({message: "¡Especie registrada!", data: especies});
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "No se pudo enviar los datos de la especie" });;
            return;
        }
    }
//controlador para encontrar a la especie por id y actualizar los datos de los campos
    updateEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id} = request.params;
            const updatedEspecies = request.body;
            // Validar y convertir tamano y peso
            if (typeof updatedEspecies.tamano === 'string') {
                updatedEspecies.tamano = Number(updatedEspecies.tamano);
                if (isNaN(updatedEspecies.tamano)) {
                    return response.status(400).json({ error: "Valor invalido para tamaño" });
                }
            }

            if (typeof updatedEspecies.peso === 'string') {
                updatedEspecies.peso = Number(updatedEspecies.peso);
                if (isNaN(updatedEspecies.peso)) {
                    return response.status(400).json({ error: "Valor invalido para peso" });
                }
            }

            const especies = await EspeciesModel.findByIdAndUpdate(id, updatedEspecies, { new: true, runValidators: true }); //Actualiza y retorna el nuevo documento
            if (!especies) {
                return response.status(404).json({ error: "Especie no encontrada" });
            }
            response.status(200).json(especies);
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "No se pudo actualizar la especie" });;
            return;
        }
    }
//controlador para encontrar a la especie por id y borrarla
    deleteEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id} = request.params;
            await EspeciesModel.findByIdAndDelete({_id: id});
            response.status(200).json({message: "Especie borrada"});
            return;
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "No se pudo borrar los datos de la especie" });
            return;
        }
    }
};

export default new EspeciesController();