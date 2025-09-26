import express from "express";
import cors from "cors";
import { connectDB } from "./db/db.js";
import { port, storageDir } from "./config.js";
import logger from "./logger.js";
import fs from "fs/promises";
import path from "path";

// routes
import authRoutes from "./routes/auth.routes.js";
import batchRoutes from "./routes/batch.routes.js";
import chainRoutes from "./routes/chain.routes.js";
import errorHandler from "./middleware/error.js";

async function ensureStorage() {
  await fs.mkdir(storageDir, { recursive: true });
}

async function start() {
  try {
    logger.info("=== STARTING APPLICATION ===");
    logger.info("Node.js version:", process.version);
    logger.info("Working directory:", process.cwd());

    await ensureStorage();
    logger.info("Storage ensured");

    logger.info("About to connect to MongoDB...");
    await connectDB();
    logger.info("Database connected successfully");

    const app = express();
    app.use(cors());
    app.use(express.json({ limit: "5mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use("/storage", express.static(path.join(process.cwd(), storageDir)));

    app.use("/api/auth", authRoutes);
    app.use("/api/batches", batchRoutes);
    app.use("/api/chain", chainRoutes);

    app.use(errorHandler);

    app.listen(port, "0.0.0.0", () => {
      logger.info(`Server running on http://localhost:${port}`);
      logger.info("=== APPLICATION STARTED SUCCESSFULLY ===");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

start().catch((err) => {
  logger.error("Startup error:", err);
  process.exit(1);
});
