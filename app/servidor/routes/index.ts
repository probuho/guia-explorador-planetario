import express from "express";
import { Router } from "express";
import EspeciesController from "../controllers/EspeciesController";
import UsuariosController from "../controllers/UsuariosController";
import JuegosController from "../controllers/JuegosController";
import LoggedIn from "../middleware/Logged-In";

const router = express.Router();

//Se crean las rutas de las especies en base al controlador
router.get("/especies", EspeciesController.getALLEspecies);
router.get("/especies/:id", EspeciesController.getEspecies);
router.post("/especies", EspeciesController.createEspecies);
router.put("/especies/:id", EspeciesController.updateEspecies);
router.delete("/especies/:id", EspeciesController.deleteEspecies);

//Se crean las rutas de usuario en base al controlador
router.post("/registro", LoggedIn, UsuariosController.createUsuarios);
router.post("/iniciar-sesion", LoggedIn, UsuariosController.loginUsuario);
router.put("/usuario/:id", LoggedIn, UsuariosController.actualizarUsuario);

//Se crean las rutas de la puntuación
router.post("/memoria", JuegosController.createOrUpdatePuntuacion);
router.get("/memoria/:userId", JuegosController.getUserPuntuacion);

export default router;