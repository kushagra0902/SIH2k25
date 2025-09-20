
import { Low, JSONFile } from "lowdb";
import { join } from "path";
import { dbFile } from "../config.js";
import fs from "fs";

const adapterFile = join(process.cwd(), dbFile); // path to db json file
const adapter = new JSONFile(adapterFile); // a path between json file and js code. So basically we need something that can help us use the json directly in js code. This is what adapter does.
if (!fs.existsSync(adapterFile)) {
  fs.writeFileSync(adapterFile, JSON.stringify({ farmers: [], batches: [], chain: [], transfers: [] }));
}
const db = new Low(adapter); // creates an insatance of lowdb adapter with json file as db. Now we can direclty use the json file in js code.

async function initDB() {
  await db.read();
  db.data = db.data || { farmers: [], batches: [], chain: [], transfers: [] };
  await db.write();
}
async function getDB() {
  if (!db.data) await initDB();
  return db;
}

export { db, initDB, getDB };


//This module sets up and manages a LowDB database using a JSON file as storage. It ensures the database file exists, initializes it with default structure if not, and provides functions to read and access the database instance. The database contains collections for farmers, batches, a simulated blockchain (chain), and transfers.

//LowDB is a small local JSON database for small projects, prototyping, and mocking. It allows us to use a JSON file as a database and provides a simple API to interact with it. It allows us to use complex features like filtering, sorting, and querying the data in a simple way.