import 'dotenv/config';
import express from "express";
import cors from "cors";

import mainRoutes from "./routes/main.js"
import userRoutes from "./routes/user.js"
import transactionsRoutes from "./routes/transactions.js"
import { getDB, closeDB } from './data/connections.js';

const app = express();

let db;
/* Routers */

app.use(express.urlencoded({ extended: false })); // esto nos permite capturar la informacion que se envia por un formulario via POST (req.body)
app.use(express.json());
app.use(cors())


//app.use('/', mainRoutes)
app.use('/api/user', userRoutes)
app.use('/api/transactions', transactionsRoutes)

// Ruta base
app.get("/", (req, res) => {
  res.json({
      message: "API Money Manager",
      endpoints: [
          { method: "GET", path: "/api/user/get_users", description: "Devuelve todos los usuarios creados en la DB" },
          { method: "POST", path: "/api/user/login", description: "Login a la app" },
          { method: "POST", path: "/api/user/insert_user", description: "Inserta un usuario en la tabla de users y crea el balance inicial en la tabla de balances" },
          { method: "POST", path: "/api/transactions/update_balance", description: "Actualiza el balance total de un usuario" },
          { method: "POST", path: "/api/transactions/create_transaccion", description: "Crea una transaccion" },
          { method: "POST", path: "/api/transactions/get_transaccions", description: "Trae una lista de transacciones" },
          { method: "POST", path: "/api/transactions/get_transactions_by_user", description: "Trae una lista de transacciones de un usuario en particular" },
          { method: "DELETE", path: "/api/user/delete_user", description: "Elimina el usuario logueado de la DB junto con sus transacciones" },
      ]
  });
});

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