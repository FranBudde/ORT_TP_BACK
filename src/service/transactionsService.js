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
      transac_dsc: body.transac_dsc,
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

    const finalAmount = body.transac_dsc === 'expenses' ? -(transactionData.amount) : transactionData.amount

    await update_balance(idUser, "$inc", finalAmount)

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

export async function get_transactions_by_user(id_user, dateFilterString, transac_dsc) {
  const db = await getDB();

  let matchQuery = { id_user: new ObjectId(id_user) };

  if (transac_dsc !== undefined && transac_dsc !== null) {
    matchQuery.transac_dsc = transac_dsc;
  }

  let startDate;
  let endDate;

  if (dateFilterString) {
    const yearMonthDayRegex = /^\d{4}-\d{2}-\d{2}$/;
    const yearMonthRegex = /^\d{4}-\d{2}$/;
    const yearRegex = /^\d{4}$/;

    if (yearMonthDayRegex.test(dateFilterString)) {
      const [year, month, day] = dateFilterString.split('-').map(Number);
      startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));
      console.log(`🔍 Filtrando por día: ${dateFilterString} (Rango UTC: ${startDate.toISOString()} a ${endDate.toISOString()})`);
    } else if (yearMonthRegex.test(dateFilterString)) {
      const [year, month] = dateFilterString.split('-').map(Number);
      startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      console.log(`🔍 Filtrando por mes: ${dateFilterString} (Rango UTC: ${startDate.toISOString()} a ${endDate.toISOString()})`);
    } else if (yearRegex.test(dateFilterString)) {
      const year = parseInt(dateFilterString);
      startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));
      console.log(`🔍 Filtrando por año: ${dateFilterString} (Rango UTC: ${startDate.toISOString()} a ${endDate.toISOString()})`);
    } else {
      throw new Error("Formato de fecha inválido. Se espera 'AAAA', 'AAAA-MM' o 'AAAA-MM-DD'.");
    }

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
  }

  try {
    const transaccionesAgrupadas = await db
      .collection(`${transactions}`)
      .aggregate([
        {
          $match: matchQuery
        },
        {
          $lookup: {
            from: "categories",
            localField: "id_categoria",
            foreignField: "_id",
            as: "categoryInfo"
          }
        },

        {
          $unwind: "$categoryInfo"
        },
        
        {
          $group: {
            _id: "$categoryInfo.name", 
            totalAmount: { $sum: "$amount" }
          }
        },
        
        {
          $project: {
            _id: 0,              
            name: "$_id",        
            amount: "$totalAmount"
          }
        }
      ])
      .toArray();

    return transaccionesAgrupadas;
  } catch (error) {
    console.error("Error al obtener y agrupar transacciones por categoría:", error);
    throw error;
  }
}

export default {
  initialize_balance,
  update_balance,
  getTransaccions,
  createTransaccion,
  get_total_balance,
  get_transactions_by_user
};