
import { getDB } from '../data/connections.js';


export async function getUsers() {
    const db = await getDB();
 
    const users = db
        .collection(`${process.env.DB_COLLECTION}`)
        .find()
        .toArray();

    return users;
}

export default {
    getUsers,
};
