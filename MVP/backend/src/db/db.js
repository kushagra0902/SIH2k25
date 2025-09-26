import mongoose from "mongoose";
import { mongoUri } from "../config.js";
import logger from "../logger.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    logger.info("MongoDB already connected, reusing connection");
    return mongoose.connection;
  }

  try {
    logger.info(`Attempting to connect to MongoDB...`);
    logger.info(`Connection URI: ${mongoUri.replace(/:[^:@]*@/, ":****@")}`); // Hide password

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    isConnected = true;
    logger.info(
      `MongoDB connected successfully to database: ${connection.connection.name}`
    );
    logger.info(`Connection state: ${mongoose.connection.readyState}`); // 1 = connected

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
      isConnected = true;
    });

    // Test the connection with a simple operation
    await mongoose.connection.db.admin().ping();
    logger.info("MongoDB ping successful");

    return connection;
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    logger.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    isConnected = false;
    throw error;
  }
}

async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB disconnected");
  }
}

// Legacy compatibility functions for gradual migration
async function initDB() {
  return await connectDB();
}

async function getDB() {
  if (!isConnected) {
    await connectDB();
  }
  return mongoose.connection;
}

export { connectDB, disconnectDB, initDB, getDB, mongoose };

//This module sets up and manages a LowDB database using a JSON file as storage. It ensures the database file exists, initializes it with default structure if not, and provides functions to read and access the database instance. The database contains collections for farmers, batches, a simulated blockchain (chain), and transfers.

//LowDB is a small local JSON database for small projects, prototyping, and mocking. It allows us to use a JSON file as a database and provides a simple API to interact with it. It allows us to use complex features like filtering, sorting, and querying the data in a simple way.
