import express from "express"; 
import transactionsController from "../controllers/transactionsController.js"; 
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/get_transaccions', verifyToken, transactionsController.getTransaccions); 
router.post('/get_transaction_by_user', verifyToken, transactionsController.getTransactionsByUser);
router.post('/get_transaction_by_user_category', verifyToken, transactionsController.getTransactionsByUserCategory);
router.post('/create_transaccion', verifyToken, transactionsController.createTransaccion);
router.post('/get_total_balance', verifyToken, transactionsController.getTotalBalance)
router.post('/update_balance', verifyToken, transactionsController.updateBalance);

export default router; 