import express from 'express';
import cors from 'cors';
import { initDB } from './db/db.js';
import { port, storageDir } from './config.js';
import logger from './logger.js';
import fs from 'fs/promises';
import path from 'path';

// routes
import authRoutes from './routes/auth.routes.js';
import batchRoutes from './routes/batch.routes.js';
import chainRoutes from './routes/chain.routes.js';
import errorHandler from './middleware/error.js';

async function ensureStorage(){
  await fs.mkdir(storageDir, { recursive: true });
}

async function start(){
  await ensureStorage();
  await initDB();
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/storage', express.static(path.join(process.cwd(), storageDir)));

  app.use('/api/auth', authRoutes);
  app.use('/api/batches', batchRoutes);
  app.use('/api/chain', chainRoutes);

  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
