import express from "express";
import mongoose from "mongoose";
import router from "./routes";

const app = express();
app.use(express.json());

//Crear la conexión con la base de datos
const MONGO_URL = `mongodb://127.0.0.1:27017/`;
mongoose.connect(MONGO_URL, {
    dbName: "exploradorPlanetario", 
    }).then(()=>{
        console.log("conectado la BD");
    }).catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
      });
//Se utilizan las rutas 
app.use("/", router);

//Se configura un puerto para probar la aplicación
app.listen(4000, () =>{
    console.log(`El servidor corre en http://localhost:4000`);
})
