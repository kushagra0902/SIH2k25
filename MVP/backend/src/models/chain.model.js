import mongoose from "mongoose";
import logger from "../logger.js";

const chainBlockSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
      unique: true,
    },
    timestamp: {
      type: Number,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      enum: ["BATCH_CREATE", "BATCH_VERIFY", "TRANSFER"],
    },
    dataHash: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    prevHash: {
      type: String,
      required: true,
      default: "0x0",
    },
    blockHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

chainBlockSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Add logging hooks
chainBlockSchema.pre("save", function (next) {
  logger.info(`About to save block: ${this.index} type: ${this.type}`);
  next();
});

chainBlockSchema.post("save", function (doc) {
  logger.info(`Block saved successfully: ${JSON.stringify(doc.toJSON())}`);
});

const ChainBlock = mongoose.model("ChainBlock", chainBlockSchema);

async function getLatestBlock() {
  try {
    logger.info("Getting latest block from chain");
    const block = await ChainBlock.findOne().sort({ index: -1 });
    logger.info(`Latest block: ${block ? block.index : "none"}`);
    return block;
  } catch (error) {
    logger.error("Error getting latest block:", error);
    throw error;
  }
}

async function addBlock(blockData) {
  try {
    logger.info(`Adding block to chain: ${JSON.stringify(blockData)}`);
    const block = new ChainBlock(blockData);
    const savedBlock = await block.save();
    logger.info(
      `Block added successfully: ${JSON.stringify(savedBlock.toJSON())}`
    );

    // Verify it was actually saved
    const count = await ChainBlock.countDocuments();
    logger.info(`Total blocks in chain: ${count}`);

    return savedBlock.toJSON();
  } catch (error) {
    logger.error("Error adding block:", error);
    throw error;
  }
}

async function getBlocksByBatchId(batchId) {
  try {
    logger.info(`Getting blocks for batch: ${batchId}`);
    const blocks = await ChainBlock.find({
      "payload.batchId": batchId,
    }).sort({ index: 1 });
    logger.info(`Found ${blocks.length} blocks for batch ${batchId}`);
    return blocks.map((b) => b.toJSON());
  } catch (error) {
    logger.error("Error getting blocks by batch id:", error);
    throw error;
  }
}

async function getAllBlocks() {
  try {
    logger.info("Getting all blocks from chain");
    const blocks = await ChainBlock.find({}).sort({ index: 1 });
    logger.info(`Found ${blocks.length} total blocks in chain`);
    return blocks.map((b) => b.toJSON());
  } catch (error) {
    logger.error("Error getting all blocks:", error);
    throw error;
  }
}

async function getBlockCount() {
  try {
    const count = await ChainBlock.countDocuments();
    logger.info(`Total blocks in database: ${count}`);
    return count;
  } catch (error) {
    logger.error("Error getting block count:", error);
    throw error;
  }
}

export {
  ChainBlock,
  getLatestBlock,
  addBlock,
  getBlocksByBatchId,
  getAllBlocks,
  getBlockCount,
};
