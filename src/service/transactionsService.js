import { ObjectId } from "mongodb";
import { getDB } from "../data/connections.js";

const totalBalances = process.env.DB_BALANCES_COLLECTION

export async function initialize_balance(id_user) {
    const db = await getDB();
    const new_balance = {
      id_user: id_user,
      amount: 0
    }
  
    const total_balances_collection = db.collection(`${totalBalances}`);
  
    try {
  
      await total_balances_collection.insertOne(new_balance);
  
    }
    catch (error) {
  
      throw ("Error al insertar el balance: ", error);
    }
  
  }
  
  export async function update_balance(id_user, operacion, monto) {
    const db = await getDB();
    const total_balances_collection = db.collection(`${totalBalances}`);
  
    try {
      const updateQuery = {};
  
      if (operacion === "$set") {
        updateQuery.$set = { amount: monto };
      } else if (operacion === "$inc") {
        updateQuery.$inc = { amount: monto };
      } else {
        throw new Error(`Operación no válida: ${operacion}. Debe ser "$set" o "$inc".`);
      }
  
      const result = await total_balances_collection.updateOne(
        { id_user: new ObjectId(id_user) },
        updateQuery
      );
  
      return result;
    } catch (error) {
      console.error("Error al actualizar el balance:", error);
      throw error;
    }
  }

  export default {
    initialize_balance,
    update_balance
  };