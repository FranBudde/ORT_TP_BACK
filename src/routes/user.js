import express from "express"; 
import userController from "../controllers/userController.js"; 

const router = express.Router();

router.get('/get_users',userController.getUsers); 
router.post('/user_auth',userController.userAuth); 

export default router; 