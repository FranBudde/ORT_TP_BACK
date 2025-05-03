import express from "express"; 
import userController from "../controllers/userController.js"; 

const router = express.Router();

router.get('/get_users',userController.getUsers); 

export default router; 