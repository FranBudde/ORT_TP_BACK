import usuarioService from "../service/userService.js";

const controller = {
    getUsers: async (req, res) => {
        const users = await usuarioService.getUsers();
       
        res.json(users);
    },
    create: (req, res) => {
        res.send('crear usuario');
    },
    
}

export default controller;