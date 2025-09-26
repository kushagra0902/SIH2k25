import mongoose from "mongoose";
import { nanoid } from "nanoid";
import logger from "../logger.js";

console.log("=== FARMER MODEL LOADED - USING MONGODB VERSION ===");

const farmerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(10),
    },
    name: {
      type: String,
      required: true,
      default: "Farmer",
    },
    wallet: {
      type: String,
      required: true,
      default: () => "0x" + nanoid(20),
    },
    createdAt: {
      type: Number,
      default: Date.now,
    },
  },
  {
    _id: false, // Disable default _id since we're using custom _id
    timestamps: false, // We're handling timestamps manually
  }
);

// Virtual to maintain compatibility with existing code that uses 'id'
farmerSchema.virtual("id").get(function () {
  return this._id;
});

// Ensure virtual fields are serialized
farmerSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Add logging hooks
farmerSchema.pre("save", function (next) {
  logger.info(`About to save farmer: ${this.name} with id: ${this._id}`);
  next();
});

farmerSchema.post("save", function (doc) {
  logger.info(`Farmer saved successfully: ${JSON.stringify(doc.toJSON())}`);
});

const Farmer = mongoose.model("Farmer", farmerSchema);

async function createFarmer({ name }) {
  try {
    logger.info(`Creating farmer with name: ${name}`);
    logger.info(`MongoDB connection state: ${mongoose.connection.readyState}`);

    const farmer = new Farmer({
      name: name || "Farmer",
    });

    logger.info(`Farmer object created: ${JSON.stringify(farmer.toJSON())}`);

    const savedFarmer = await farmer.save();
    logger.info(
      `Farmer saved to database: ${JSON.stringify(savedFarmer.toJSON())}`
    );

    // Verify it was actually saved
    const count = await Farmer.countDocuments();
    logger.info(`Total farmers in database: ${count}`);

    return savedFarmer.toJSON();
  } catch (error) {
    logger.error(`Error creating farmer:`, error);
    throw error;
  }
}

async function listFarmers() {
  try {
    logger.info(`Fetching all farmers from database`);
    logger.info(`MongoDB connection state: ${mongoose.connection.readyState}`);

    const farmers = await Farmer.find({});
    logger.info(`Found ${farmers.length} farmers in database`);

    return farmers.map((f) => f.toJSON());
  } catch (error) {
    logger.error(`Error listing farmers:`, error);
    throw error;
  }
}

async function getFarmerById(id) {
  try {
    logger.info(`Fetching farmer by id: ${id}`);
    const farmer = await Farmer.findById(id);
    logger.info(`Farmer found: ${farmer ? "yes" : "no"}`);
    return farmer ? farmer.toJSON() : null;
  } catch (error) {
    logger.error(`Error getting farmer by id:`, error);
    throw error;
  }
}

export { Farmer, createFarmer, listFarmers, getFarmerById };
