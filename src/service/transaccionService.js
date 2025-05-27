
import { getDB } from '../data/connections.js';
import { ObjectId } from 'mongodb';

const transaccionCollecion = process.env.DB_TRASACTIONS_COLLECTION

export async function getTransaccions() {
    const db = await getDB();
 
    const transaccions = db
        .collection(`${transaccionCollecion}`)
        .find()
        .toArray();

    return transaccions;
}

export async function createTransaccion(body, idUser) {
    const db = await getDB();
    const session = db.client.startSession();
    
    try {
        session.startTransaction();
        
        const transactionData = {
            date: new Date(),
            id_user: body.id_user,
            id_categoria: body.categoria,
            amount: body.amount,
            comment: body.comment,
        };

        const result = await db.collection(`${transaccionCollecion}`).insertOne(
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


