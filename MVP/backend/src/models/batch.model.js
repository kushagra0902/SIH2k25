import { getDB } from "../db/db.js";
import { nanoid } from "nanoid";

async function createBatch({ farmerId, metadata, metadataHash, photos = [] }) {
  const db = await getDB();
  const batch = {
    id: nanoid(12),
    farmerId,
    metadata,
    metadataHash,
    photos,
    createdAt: Date.now(),
    currentOwner: farmerId,
    status: "CREATED",
  };
  db.data.batches.push(batch); // adds the new batch to the batches array in the db instance
  await db.write(); //writes to actual json file on disk from the instance
  return batch;
}

//takes info like farmer id, metadata (crop, quantity, harvest date, geo, photos), metadata hash (hash of the metadata) and photos (array of photo paths). It creates a new batch object with a unique id, farmer id, metadata, metadata hash, photos, creation timestamp, current owner (initially the farmer), and status (initially 'CREATED'). The batch is then added to the batches array in the database and the database is written to disk. Finally, it returns the created batch object.

async function getBatch(batchId) {
  const db = await getDB();
  return db.data.batches.find((b) => b.id === batchId);
}

async function updateBatch(batchId, patch) {
  const db = await getDB();
  const idx = db.data.batches.findIndex((b) => b.id === batchId);
  if (idx === -1) return null;
  db.data.batches[idx] = { ...db.data.batches[idx], ...patch };
  await db.write();
  return db.data.batches[idx];
}

export { createBatch, getBatch, updateBatch };
