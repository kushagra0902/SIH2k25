import express from 'express';
import { createFarmer, listFarmers } from '../models/farmer.model.js';
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name } = req.body;
    const farmer = await createFarmer({ name });
    res.json({ ok: true, farmer });
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const farmers = await listFarmers();
    res.json({ ok: true, farmers });
  } catch (err) { next(err); }
});

export default router;
