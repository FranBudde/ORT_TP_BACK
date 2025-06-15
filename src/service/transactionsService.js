import { ObjectId } from "mongodb";
import { getDB } from "../data/connections.js";

const totalBalances = process.env.DB_BALANCES_COLLECTION
const transactions = process.env.DB_TRASACTIONS_COLLECTION

export async function getTransaccions() {
    const db = await getDB();
 
    const transaccions = db
        .collection(`${transactions}`)
        .find()
        .toArray();

    return transaccions;
}

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

  export async function createTransaccion(body, idUser) {
      const db = await getDB();
      const session = db.client.startSession();
      try {
          session.startTransaction();

          const parsedAmount = Number(body.amount);
          if (body.amount === undefined || Number.isNaN(parsedAmount)) {
            throw new Error(`El campo amount debe ser un número válido. Valor recibido: ${body.amount}`);
          }
          const transactionData = {
              date: new Date(),
              id_user: new ObjectId(idUser),                   
              id_categoria: new ObjectId(body.id_categoria), 
              amount: parsedAmount,
              comment: body.comment ?? "",
          };

          const catId = transactionData.id_categoria;
          console.log("🔍 Buscando categoría con _id =", catId.toHexString());
          const categoria = await db
              .collection("categories")
              .findOne(
                { _id: transactionData.id_categoria },
                { session }
            );

          if (!categoria) {
            throw new Error("La categoría indicada no existe.");
          }

          const usuario = await db
              .collection("users")
              .findOne(
                { _id: transactionData.id_user },
                { session }
              );

          if (!usuario) {
            throw new Error("El usuario indicado no existe.");
          }
  
          await update_balance( idUser, "$inc", transactionData.amount)

          const result = await db.collection(`${transactions}`).insertOne(
              transactionData,
              { session }
          );

          await session.commitTransaction();

          return {
              _id: result.insertedId,
              ...transactionData
          };
      } catch (error) {
          await session.abortTransaction();
          throw error;
      } finally {
          session.endSession();
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

  export async function get_total_balance(id_user) {
    const db = await getDB();
 
    const total_balance = await db
        .collection(`${totalBalances}`)
        .findOne({ id_user: new ObjectId(id_user) })
  
    return total_balance["amount"];
  }

  export async function deleteTransaccions(body){
    const db = await getDB();
      const session = db.client.startSession();
      try {
          session.startTransaction();

          const transactionId =body.id;
          if (!transactionId){
            throw new Error("ES necesario el id de la transaccion para eliminarla");
          }

          const transactionToDelete = await db.collection(`${transactions}`).findOne(
            {_id: new ObjectId(transactionId)},
            {session}
          );
          if (!transactionToDelete){
            throw new Error ("La transaccion a eliminar no existe");

          }
 
          await update_balance(transactionToDelete.id_user,"$inc",-transactionToDelete.amount);
          const result = await db.collection(`${transactions}`).deleteOne(
            { _id: new ObjectId(transactionId) },
            { session }
           );
          await session.commitTransaction();
          return {success: true, message: "Transacción eliminada y balance actualizado."}
      }catch (error){
        await session.abortTransaction();
        console.error("Error al eliminar la transacción:", error);
        throw error;
      } finally {
        session.endSession();

      }
    

    
  }

  async function validarCategoria() {

  }

  export default {
    initialize_balance,
    update_balance,
    getTransaccions,
    createTransaccion,
    get_total_balance,
    deleteTransaccions
  };