// require('dotenv').config();
import express from "express";

import mainRoutes from "./routes/main.js"
import userRoutes from "./routes/user.js"

const app = express();

/* Routers */

app.use(express.urlencoded({ extended: false })); // esto nos permite capturar la informacion que se envia por un formulario via POST (req.body)
app.use(express.json());


app.use('/', mainRoutes)
app.use('/user', userRoutes)

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log(`Levantando un servidor con Express en: http://localhost:${port}`);
});