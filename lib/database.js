import { MongoClient } from "mongodb";

const { DB_URL, DB_NAME, MONGODB_URI, MONGODB_DB } = process.env;
const uri = DB_URL || MONGODB_URI;
export const databaseConfigured = Boolean(uri);
const name = DB_NAME || MONGODB_DB || (DB_URL ? "coffee-house" : "malnad");

let connection;
export async function database() {
  if (!connection) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    connection = client.connect().catch((error) => {
      connection = undefined;
      throw error;
    });
  }
  return (await connection).db(name);
}
