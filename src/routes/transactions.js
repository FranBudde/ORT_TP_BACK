import express from "express"; 
import transactionsController from "../controllers/transactionsController.js"; 
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/get_transaccions',transactionsController.getTransaccions); 
router.post('/create_transaccion',verifyToken,transactionsController.createTransaccion); 
router.post('/update_balance', transactionsController.updateBalance);

export default router; 