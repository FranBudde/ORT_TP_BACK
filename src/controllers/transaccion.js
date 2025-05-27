import {getTransaccions , createTransaccion} from "../service/transaccionService.js";

const controller = {
  getTransaccions: async (req, res) => {
    const transaccions = await getTransaccions();

    res
      .status(200)
      .json({ message: "Transaccion retrieved successfully", data: transaccions });
  },
  
  createTransaccion: async (req, res) => {
    try {
        const body = req.body;
        const { id } = req.params;
        
        const nuevaTransaccion = await createTransaccion(body, id);
        
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
  }

};

export default controller;
