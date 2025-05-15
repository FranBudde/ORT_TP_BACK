import { getDB } from "../data/connections.js";
import { ObjectId } from "mongodb";

const usersCollection = process.env.DB_USERS_COLLECTION;

export async function getUsers() {
  const db = await getDB();

  const users = db.collection(`${usersCollection}`).find().toArray();

  return users;
}

export async function login(username, password) {
  const db = await getDB();

  const user = db
    .collection(`${usersCollection}`)
    .findOne({ userName: username, password: password });

  return user;
}

export async function check_user_exists(username) {
  const db = await getDB();

  const user = db
    .collection(`${usersCollection}`)
    .findOne({ userName: username });

  return user;
}

export async function insert_user(newUser) {
  const db = await getDB();

  const users_collection = db.collection(`${usersCollection}`);

  try {
    
    const result = await users_collection.insertOne(newUser);
    
    return result;
  }
  catch (error) {
    
    throw error;
  }
}

export default {
  getUsers,
  login,
  check_user_exists,
  insert_user,
};
