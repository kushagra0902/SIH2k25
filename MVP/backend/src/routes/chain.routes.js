import express from 'express';
import { getDB } from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = await getDB();
    res.json({ ok: true, chain: db.data.chain });
  } catch (err) { next(err); }
});

export default router;


//fetches the entire simulated blockchain from the database and returns it as a JSON response. Each block in the chain contains information about the type of action (e.g., batch creation, transfer), a data hash, a payload with relevant details, a timestamp, and a reference to the previous block's hash. This route is useful for viewing the complete history of actions recorded on the simulated blockchain.