import express from "express"; 
import userController from "../controllers/userController.js"; 

const router = express.Router();

router.get('/get_users',userController.getUsers); 
router.post('/login',userController.login); 
router.post('/insert_user', userController.insertUser);
router.post('/update_balance', userController.updateBalance);

export default router; 