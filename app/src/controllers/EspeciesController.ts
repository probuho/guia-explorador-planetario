import express from "express";
import { EspeciesModel } from "../db/especies";
class EspeciesController{
    
//controlador para mostrar todas las especies
    getALLEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const especies = await EspeciesModel.find();
            response.status(200).json({data: especies});
            return;
        } catch (error) {
            response.sendStatus(400);
            return;
        }
    }
//controlador para mostrar una especie por id
    getEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id} = request.params;
            const especies = await EspeciesModel.findById(id);
            response.status(200).json({data: especies});
            return;
        } catch (error) {
            response.sendStatus(400);
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
            response.sendStatus(400);
            return;
        }
    }
//controlador para encontrar a la especie por id y actualizar los datos de los campos
    updateEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id} = request.params;
            const {nombre, tamano, peso, habitat, alimentacion, tipo, descripcion } = request.body;
            const especies = await EspeciesModel.findById(id);
            if(especies){
                especies.nombre = nombre;
                especies.tamano = tamano;
                especies.peso = peso;
                especies.habitat = habitat;
                especies.alimentacion = alimentacion;
                especies.tipo = tipo;
                especies.descripcion = descripcion;
                await especies.save();
                response.status(200).json({message: "¡Especie actualizada!", data: especies});
                return;
            }
            response.sendStatus(400);
            return;
        } catch (error) {
            response.sendStatus(400);
            return;
        }
    }
//controlador para encontrar a la especie por id y borrarla
    deleteEspecies = async (request: express.Request, response: express.Response) => {
        try{
            const {id } = request.params;
            await EspeciesModel.findByIdAndDelete({_id: id});
            response.status(200).json({message: "Especie borrada"});
            return;
        } catch (error) {
            response.sendStatus(400);
            return;
        }
    }
};

export default new EspeciesController();