import { getDB } from "../data/connections.js";
import bcrypt from "bcrypt";

const usersCollection = process.env.DB_USERS_COLLECTION;
const totalBalances = process.env.DB_BALANCES_COLLECTION

export async function getUsers() {
  const db = await getDB();

  const users = db.collection(`${usersCollection}`).find().toArray();

  return users;
}

export async function get_user_by_credentials(username, password) {
  const db = await getDB();

  const user = db
    .collection(`${usersCollection}`)
    .findOne({ userName: username, password: password });

  return user;
}

export async function get_user_by_username(username) {
  const db = await getDB();

  const user = db
    .collection(`${usersCollection}`)
    .findOne({ userName: username });

  return user;
}

export async function insert_user(newUser) {
  const db = await getDB();

  const users_collection = db.collection(`${usersCollection}`);
  const saltRounds = 10;
  // Hasheo la contraseña
  newUser["password"] = await bcrypt.hash(newUser["password"], saltRounds);

  try {
    
    const result = await users_collection.insertOne(newUser);
    console.log("User inserted successfully...")
    return result;
  }
  catch (error) {
    
    throw ("Error al insertar: ", error);
  }
}

export async function initialize_balance(id_user) {
  const db = await getDB();
  const new_balance = {
    id_user: id_user,
    amount: 0
  }

  const total_balances_collection = db.collection(`${totalBalances}`);

  try {
    
    const result = await total_balances_collection.insertOne(new_balance);
    
    return result;
  }
  catch (error) {
    
    throw ("Error al insertar el balance: ", error);
  }

}

export default {
  getUsers,
  get_user_by_credentials,
  get_user_by_username,
  insert_user,
  initialize_balance
};
