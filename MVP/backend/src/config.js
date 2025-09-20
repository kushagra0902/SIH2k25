import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 4000;
const dbFile = process.env.DB_FILE || "./db.json";
const storageDir = process.env.STORAGE_DIR || "./storage";
const baseUrl = process.env.BASE_URL || "http://localhost:4000";

export { port, dbFile, storageDir, baseUrl };


//Sets up the config from the env file or uses default values if not provided.