
import { getDB } from '../data/connections.js';
import { ObjectId } from 'mongodb';

const usersCollection = process.env.DB_COLLECTION

export async function getUsers() {
    const db = await getDB();
 
    const users = db
        .collection(`${usersCollection}`)
        .find()
        .toArray();

    return users;
}

export async function userAuth(username, password) {
    const db = await getDB();

    const user = db
      .collection(`${usersCollection}`)
      .findOne({ userName: username, password: password });

    return user;
  }

export default {
    getUsers,
    userAuth
};
