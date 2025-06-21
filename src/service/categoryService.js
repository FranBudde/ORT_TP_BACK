import { getDB } from "../data/connections.js";

export async function getCategoryByName(name) {
  const db = await getDB();
  return await db.collection("categories").findOne({ name });
}
