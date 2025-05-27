import express from "express"; 
import transaccionController from "../controllers/transaccion.js"; 

const router = express.Router();

router.get('/get_transaccions',transaccionController.getTransaccions); 
router.post('/create_transaccion',transaccionController.createTransaccion); 

export default router; 