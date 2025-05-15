import userService from "../service/userService.js";
import jwt from "jsonwebtoken";

const userController = {
  getUsers: async (req, res) => {
    const users = await userService.getUsers();

    res
      .status(200)
      .json({ message: "Users retrieved successfully", data: users });
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    let response;

    if (!username || !password) {
      response = res
        .status(400)
        .json({ message: "User or Password cannot be empty" });
    } else {
      const user = await userService.login(username, password);
      if (user) {
        const token = jwt.sign(
          { userId: user._id, username: user.userName },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        response = res
          .status(200)
          .json({ message: "User retrieved successfully", token: token }); // Usuario encontrado, devuelve la información con un 200 OK
      } else {
        response = res
          .status(403)
          .json({ message: "Forbidden: Invalid User or Password" }); // Usuario no encontrado, devuelve un 403 Forbbiden
      }
    }

    return response;
  },
  insertUser: async (req, res) => {
    const newUser = req.body;
    const username = newUser["userName"]

    //Chequeo si existe el usuario
    const check_user_exists = await userService.check_user_exists(username);

    let response;

    if (check_user_exists) { //Si existe rompo con 500 error
      response = res.status(500).json({ message: `Username: ${username} already exists` }); // Usuario encontrado, devuelve un 500
    } 
    else {
      try {
        const result = await userService.insert_user(newUser);
        // Pregunto si el insert dio true
        if (result.acknowledged) {
          response = res
            .status(200)
            .json({ message: `User ${username} inserted successfully` }); // Usuario insertado correctamente, devuelvo 200 OK
        } else {
          response = res
            .status(500)
            .json({ message: `Could not insert user ${username}` }); 
        }
      } catch (error) {
        response = res
          .status(500)
          .json({ message: error });
      }
    }

    return response
  },
};

export default userController;
