import userService from "../service/userService.js";
import jwt from 'jsonwebtoken';

const controller = {
  getUsers: async (req, res) => {
    const users = await userService.getUsers();

    res
      .status(200)
      .json({ message: "Users retrieved successfully", data: users });
  },
  userAuth: async (req, res) => {
    const { username, password } = req.body;
    let response;

    if (!username || !password) {
      response = res
        .status(400)
        .json({ message: "User or Password cannot be empty" });
    } else {
      const user = await userService.userAuth(username, password);
      if (user) {
        const token = jwt.sign({ userId: user._id, username: user.userName }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Guarda tu clave secreta en una variable de entorno
        response = res
          .status(200)
          .json({ message: "User retrieved successfully", token: token }); // Usuario encontrado, devuelve la información con un 200 OK
      } else {
        response = res
          .status(403)
          .json({ message: "Forbbiden: Invalid User or Password" }); // Usuario no encontrado, devuelve un 403 Forbbiden
      }
    }

    return response;
  },
};

export default controller;
