import express from "express"; 
import transactionsController from "../controllers/transactionsController.js"; 
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/get_transaccions',transactionsController.getTransaccions); 
router.post('/get_transaction_by_user', transactionsController.getTransactionsByUser);
router.post('/get_transaction_by_user_category', transactionsController.getTransactionsByUserCategory);
router.post('/create_transaccion',verifyToken,transactionsController.createTransaccion);
router.post('/get_total_balance', transactionsController.getTotalBalance)
router.post('/update_balance', verifyToken, transactionsController.updateBalance);

export default router; 