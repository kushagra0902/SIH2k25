import mongoose from "mongoose";
import { nanoid } from "nanoid";
import logger from "../logger.js";

const batchSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(12),
    },
    farmerId: {
      type: String,
      required: true,
      ref: "Farmer",
    },
    metadata: {
      crop: String,
      quantity: String,
      harvestDate: String,
      geo: String,
      photos: [String],
    },
    metadataHash: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Number,
      default: Date.now,
    },
    currentOwner: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["CREATED", "IN_TRANSIT", "VERIFIED", "DELIVERED"],
      default: "CREATED",
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

// Virtual to maintain compatibility
batchSchema.virtual("id").get(function () {
  return this._id;
});

batchSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Add logging hooks
batchSchema.pre("save", function (next) {
  logger.info(`About to save batch: ${this._id} for farmer: ${this.farmerId}`);
  next();
});

batchSchema.post("save", function (doc) {
  logger.info(`Batch saved successfully: ${JSON.stringify(doc.toJSON())}`);
});

const Batch = mongoose.model("Batch", batchSchema);

async function createBatch({ farmerId, metadata, metadataHash, photos = [] }) {
  try {
    logger.info(`Creating batch for farmer: ${farmerId}`);
    logger.info(`Metadata: ${JSON.stringify(metadata)}`);
    logger.info(`MongoDB connection state: ${mongoose.connection.readyState}`);

    const batch = new Batch({
      farmerId,
      metadata,
      metadataHash,
      photos,
      currentOwner: farmerId,
    });

    logger.info(`Batch object created: ${JSON.stringify(batch.toJSON())}`);

    const savedBatch = await batch.save();
    logger.info(
      `Batch saved to database: ${JSON.stringify(savedBatch.toJSON())}`
    );

    // Verify it was actually saved
    const count = await Batch.countDocuments();
    logger.info(`Total batches in database: ${count}`);

    return savedBatch.toJSON();
  } catch (error) {
    logger.error(`Error creating batch:`, error);
    throw error;
  }
}

async function getBatch(batchId) {
  try {
    logger.info(`Fetching batch by id: ${batchId}`);
    const batch = await Batch.findById(batchId);
    logger.info(`Batch found: ${batch ? "yes" : "no"}`);
    return batch ? batch.toJSON() : null;
  } catch (error) {
    logger.error(`Error getting batch:`, error);
    throw error;
  }
}

async function updateBatch(batchId, patch) {
  try {
    logger.info(`Updating batch ${batchId} with:`, patch);
    const batch = await Batch.findByIdAndUpdate(batchId, patch, {
      new: true,
      runValidators: true,
    });
    logger.info(`Batch updated: ${batch ? "yes" : "no"}`);
    return batch ? batch.toJSON() : null;
  } catch (error) {
    logger.error(`Error updating batch:`, error);
    throw error;
  }
}

async function listBatches(filter = {}) {
  const batches = await Batch.find(filter);
  return batches.map((b) => b.toJSON());
}

async function getBatchesByFarmer(farmerId) {
  return await listBatches({ farmerId });
}

export {
  Batch,
  createBatch,
  getBatch,
  updateBatch,
  listBatches,
  getBatchesByFarmer,
};
