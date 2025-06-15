import transactionsService from "../service/transactionsService.js";

const transactionsController = {

    getTransaccions: async (req, res) => {
    const transaccions = await transactionsService.getTransaccions();

    res
      .status(200)
      .json({ message: "Transaccion retrieved successfully", data: transaccions });
  },

  createTransaccion: async (req, res) => {
    try {
        const body = req.body;
        const idUser = req.userId;
        
        const nuevaTransaccion = await transactionsService.createTransaccion(body, idUser);
        
        res.status(201).json({
            message: "Se creó la transacción exitosamente",
            data: nuevaTransaccion
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear transacción",
            error: error.message
        });
    }
  },

  getTotalBalance: async (req, res) => {
    const { id_user } = req.body

    try {
      const data = await transactionsService.get_total_balance(id_user)
      res.status(200).json({data: data, message: "Balance obteined successfully"})
    } catch (error) {
      res.status(500).json({message: "Could not get balance"})
    }
  },


  updateBalance: async (req, res) => {
    const { id_user, operacion, monto } = req.body

    try {
      await transactionsService.update_balance(id_user, operacion, monto)
      res.status(200).json({message: "Balance updated successfully"})
    } catch (error) {
      res.status(500).json({message: "Could not update balance"})
    }
  },
   deleteTransaccion: async (req, res) => { 
        try {
            const body = req.body;
            
            
            const result = await transactionsService.deleteTransaccions(body);
            
            res.status(200).json({
                message: "Transacción eliminada y balance actualizado exitosamente",
                data: result
            });
        } catch (error) {
            console.error("Error al eliminar transacción:", error);
            res.status(error.status || 500).json({ 
                message: "Error al eliminar transacción",
                error: error.message
            });
        }
    }

};


export default transactionsController;
