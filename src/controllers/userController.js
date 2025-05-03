import usuarioService from "../service/usuarioService.js";

const controller = {
    detail: (req, res) => {
        const mensajeUser = usuarioService.mensajeUsuario();
        res.send(mensajeUser);
    },
    create: (req, res) => {
        res.send('crear usuario');
    },
    
}

export default controller;