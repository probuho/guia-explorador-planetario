import express from "express";
import { Router } from "express";
import EspeciesController from "../controllers/EspeciesController";

const router = express.Router();

//se crean las rutas de para cada uno de los controladores
router.get("/especies", EspeciesController.getALLEspecies);
router.get("/especies/:id", EspeciesController.getEspecies);
router.post("/especies", EspeciesController.createEspecies);
router.put("/especies/:id", EspeciesController.updateEspecies);
router.delete("/especies/:id", EspeciesController.deleteEspecies);

export default router;
