import transactionsService from "../service/transactionsService.js";

const transactionsController = {

  getTransaccions: async (req, res) => {
    const transaccions = await getTransaccions();

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
      res.status(200).json({ data: data, message: "Balance obteined successfully" })
    } catch (error) {
      res.status(500).json({ message: "Could not get balance" })
    }
  },


  updateBalance: async (req, res) => {
    const { id_user, operacion, monto } = req.body

    try {
      await transactionsService.update_balance(id_user, operacion, monto)
      res.status(200).json({ message: "Balance updated successfully" })
    } catch (error) {
      res.status(500).json({ message: "Could not update balance" })
    }
  },

  getTransactionsByUser: async (req, res) => {
    const { id_user, date, transac_dsc } = req.body

    try {
      const data = await transactionsService.get_transactions_by_user(id_user, date, transac_dsc)
      res.status(200).json({ data: data, message: "Transactions obteined successfully" })
    } catch (error) {
      res.status(500).json({ message: "Could not get transactions" })
    }
  },


};

export default transactionsController;
