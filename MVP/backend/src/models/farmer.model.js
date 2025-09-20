import { getDB } from "../db/db.js";
import { nanoid } from "nanoid";

async function createFarmer({ name }) {
  const db = await getDB();
  const farmer = {
    id: nanoid(10),
    name: name || "Farmer",
    wallet: "0x" + nanoid(20),
    createdAt: Date.now(),
  };
  db.data.farmers.push(farmer);
  await db.write();
  return farmer;
}

//creates a new farmer with a unique id, name (defaulting to 'Farmer' if not provided), a simulated wallet address, and a creation timestamp. The farmer is added to the farmers array in the database and the database is written to disk. Finally, it returns the created farmer object.

async function listFarmers() {
  const db = await getDB();
  return db.data.farmers;
}

export { createFarmer, listFarmers };
//provides functions to create a new farmer and list all farmers. The createFarmer function generates a unique id and wallet address for the farmer, while the listFarmers function retrieves all farmers from the database.