import express from "express";
import { Router } from "express";
import EspeciesController from "../controllers/EspeciesController.js";
import UsuariosController from "../controllers/UsuariosController.js";
import JuegosController from "../controllers/JuegosController.js";
import LoggedIn from "../middleware/Logged-In.js";

const router = express.Router();

//Se crean las rutas de las especies en base al controlador
router.get("/especies", EspeciesController.getALLEspecies);
router.get("/especies/:id", EspeciesController.getEspecies);
router.post("/especies", UsuariosController.verificarToken, EspeciesController.createEspecies);
router.put("/especies/:id", UsuariosController.verificarToken, EspeciesController.updateEspecies);
router.delete("/especies/:id", UsuariosController.verificarToken, EspeciesController.deleteEspecies);

//Se crean las rutas de usuario en base al controlador
router.post("/registro", LoggedIn, UsuariosController.createUsuarios);
router.post("/iniciar-sesion", LoggedIn, UsuariosController.loginUsuario);
router.put("/usuario/:id", LoggedIn, UsuariosController.verificarToken, UsuariosController.actualizarUsuario);
router.post("/logout", UsuariosController.verificarToken, UsuariosController.logoutUsuario)
router.post("/refrescar-token", UsuariosController.refrescarToken);

//Se crean las rutas de la puntuación
router.post("/memoria", UsuariosController.verificarToken, JuegosController.createOrUpdatePuntuacion);
router.get("/memoria/:userId", UsuariosController.verificarToken, JuegosController.getUserPuntuacion);

export default router;