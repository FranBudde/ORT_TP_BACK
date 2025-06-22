import { MongoClient } from "mongodb";

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.fiksnhi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw error;
  }
}

async function getDB() {
  if (!db) {
    db = await connectDB(); // Conecta solo si no hay una instancia existente
  }
  return db;
}

async function closeDB() {
    if (client && db) { // Asegúrate de que la conexión se haya establecido
      await client.close();
      db = null; // Resetea la instancia para una nueva conexión si es necesario
      console.log('Conexión a MongoDB cerrada');
    }
  }

export { getDB, closeDB };