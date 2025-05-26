import transactionsService from "../service/transactionsService.js";

const transactionsController = {
  updateBalance: async (req, res) => {
    const { id_user, operacion, monto } = req.body

    try {
      await transactionsService.update_balance(id_user, operacion, monto)
      res.status(200).json({message: "Balance updated successfully"})
    } catch (error) {
      res.status(500).json({message: "Could not update balance"})
    }
  }
};

export default transactionsController;
