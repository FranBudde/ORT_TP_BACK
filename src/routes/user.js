import express from "express"; 
import mainController from "../controllers/userController.js"; 

const router = express.Router();

// router.get('/detail', mainController.index); 
router.get('/create',mainController.detail); 

export default router; 