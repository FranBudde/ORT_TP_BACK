import userService from "../service/userService.js";

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
        response = res
          .status(200)
          .json({ message: "User retrieved successfully", data: user }); // Usuario encontrado, devuelve la información con un 200 OK
      } else {
        response = res
          .status(404)
          .json({ message: "Invalid User or Password" }); // Usuario no encontrado, devuelve un 404 Not Found
      }
    }

    return response;
  },
};

export default controller;
