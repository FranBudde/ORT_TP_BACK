import 'dotenv/config';
import express from "express";
import cors from "cors";

import mainRoutes from "./routes/main.js"
import userRoutes from "./routes/user.js"
import { getDB, closeDB } from './data/connections.js';

const app = express();

let db;
/* Routers */

app.use(express.urlencoded({ extended: false })); // esto nos permite capturar la informacion que se envia por un formulario via POST (req.body)
app.use(express.json());
app.use(cors())


app.use('/', mainRoutes)
app.use('/user', userRoutes)

const port = process.env.PORT || 3030;

app.listen(port, async () => {
    console.log(`Levantando un servidor con Express en: http://localhost:${port}`);
    db = await getDB(); // Inicializa la conexión al iniciar el servidor
});

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
    console.log('Recibida señal de interrupción. Cerrando la conexión a la base de datos...');
    if (db) {
      await closeDB();
    }
    process.exit(0);
  });