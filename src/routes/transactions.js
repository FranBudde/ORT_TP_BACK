import express from "express"; 
import transactionsController from "../controllers/transactionsController.js"; 

const router = express.Router();

router.post('/update_balance', transactionsController.updateBalance);

export default router; 