import { connectDB } from "./src/db/db.js";
import { createFarmer, listFarmers } from "./src/models/farmer.model.js";
import logger from "./src/logger.js";

async function testConnection() {
  try {
    logger.info("=== MongoDB Connection Test ===");

    // Test connection
    await connectDB();
    logger.info("✓ Connection established");

    // Test creating a farmer
    const farmer = await createFarmer({ name: "Test Farmer" });
    logger.info("✓ Farmer created:", farmer);

    // Test listing farmers
    const farmers = await listFarmers();
    logger.info(`✓ Listed farmers: ${farmers.length} found`);

    // List all farmers with details
    farmers.forEach((f) => {
      logger.info(`  - ${f.name} (${f.id}) wallet: ${f.wallet}`);
    });

    logger.info("=== Test completed successfully ===");
    process.exit(0);
  } catch (error) {
    logger.error("=== Test failed ===");
    logger.error("Error:", error);
    process.exit(1);
  }
}

testConnection();
