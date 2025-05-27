import { ObjectId } from "mongodb";
import { getDB } from "../data/connections.js";
import bcrypt from "bcrypt";

const usersCollection = process.env.DB_USERS_COLLECTION;


export async function getUsers() {
  const db = await getDB();

  const users = db.collection(`${usersCollection}`).find().toArray();

  return users;
}

export async function get_user_by_credentials(username, password) {

  const db = await getDB();

  const user = await db
    .collection(`${usersCollection}`)
    .findOne({ userName: username });

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    return null;
}

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

    await users_collection.insertOne(newUser);
    console.log("User inserted successfully...")
  }
  catch (error) {

    throw ("Error al insertar: ", error);
  }
}



export default {
  getUsers,
  get_user_by_credentials,
  get_user_by_username,
  insert_user
};
