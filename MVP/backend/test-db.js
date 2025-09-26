// This file is to test which database system is actually being used
import { createFarmer, listFarmers } from "./src/models/farmer.model.js";
import { connectDB } from "./src/db/db.js";
import logger from "./src/logger.js";

console.log("=== RUNNING DATABASE TEST ===");

async function testWhichDB() {
  try {
    console.log("Connecting to MongoDB first...");
    await connectDB();
    console.log("MongoDB connected successfully!");

    console.log("Creating a test farmer...");
    const farmer = await createFarmer({
      name: "DATABASE_TEST_FARMER_" + Date.now(),
    });
    console.log("Created farmer:", JSON.stringify(farmer, null, 2));

    console.log("Listing all farmers...");
    const farmers = await listFarmers();
    console.log(`Found ${farmers.length} farmers total`);

    console.log("=== TEST COMPLETED ===");

    // This will help us see which database is being used
    if (farmer._id) {
      console.log("✓ Using MongoDB (has _id field)");
    } else if (
      farmer.id &&
      typeof farmer.id === "string" &&
      farmer.id.length === 10
    ) {
      console.log("✓ Using MongoDB (has custom nanoid)");
    } else {
      console.log("? Unknown database format");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }

  process.exit(0);
}

testWhichDB();
