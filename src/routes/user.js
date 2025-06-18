import express from "express"; 
import userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/get_users', userController.getUsers); 
router.post('/login', userController.login); 
router.post('/insert_user', userController.insertUser);
router.delete("/delete_user", verifyToken, userController.deleteUser);

export default router; 