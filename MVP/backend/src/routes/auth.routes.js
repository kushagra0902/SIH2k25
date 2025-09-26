import express from "express";
import { createFarmer, listFarmers } from "../models/farmer.model.js";
import logger from "../logger.js";
import mongoose from "mongoose";
const router = express.Router();

// Debug endpoint to check which database we're using
router.get("/debug", async (req, res) => {
  try {
    logger.info("DEBUG endpoint called");
    const status = {
      database: "MongoDB",
      connected: mongoose.connection.readyState === 1,
      connectionName: mongoose.connection.name,
      models: Object.keys(mongoose.models),
      timestamp: new Date().toISOString(),
    };
    logger.info("Debug status:", JSON.stringify(status, null, 2));
    res.json({ ok: true, status });
  } catch (err) {
    logger.error("Error in debug endpoint:", err);
    res.json({ ok: false, error: err.message });
  }
});

router.post("/register", async (req, res, next) => {
  try {
    logger.info("POST /api/auth/register called");
    const { name } = req.body;
    logger.info(`Request body: ${JSON.stringify(req.body)}`);

    const farmer = await createFarmer({ name });
    logger.info(`Created farmer response: ${JSON.stringify(farmer)}`);

    res.json({ ok: true, farmer });
  } catch (err) {
    logger.error("Error in /register route:", err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    logger.info("GET /api/auth/ called");
    const farmers = await listFarmers();
    logger.info(`Retrieved ${farmers.length} farmers`);
    res.json({ ok: true, farmers });
  } catch (err) {
    logger.error("Error in / route:", err);
    next(err);
  }
});

export default router;
