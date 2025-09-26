import dotenv from "dotenv";
dotenv.config();

console.log("=== ENVIRONMENT VARIABLES DEBUG ===");
console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);
console.log(
  "All env vars related to MONGO:",
  Object.keys(process.env).filter((key) => key.includes("MONGO"))
);
console.log("Current working directory:", process.cwd());
console.log("==========================================");

const port = process.env.PORT || 4000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/sih2025-mvp";
const storageDir = process.env.STORAGE_DIR || "./storage";
const baseUrl = process.env.BASE_URL || "http://localhost:4000";

console.log("Final mongoUri being used:", mongoUri);

export { port, mongoUri, storageDir, baseUrl };

//Sets up the config from the env file or uses default values if not provided.
