import {
  getLatestBlock,
  addBlock,
  getBlocksByBatchId,
} from "../models/chain.model.js";
import { sha256 } from "./hash.service.js";

// Very simple append-only chain (no mining) for MVP
async function appendBlock({ type, dataHash, payload = {} }) {
  // Get the latest block to determine the previous hash
  const latestBlock = await getLatestBlock();
  const prevHash = latestBlock ? latestBlock.blockHash : "0x0";
  const index = latestBlock ? latestBlock.index + 1 : 1;

  const block = {
    index,
    timestamp: Date.now(),
    type,
    dataHash,
    payload,
    prevHash,
  };

  // Generate the block hash
  block.blockHash = sha256(block);

  // Add the block to the chain
  return await addBlock(block);
}

async function findBlocksByBatchId(batchId) {
  return await getBlocksByBatchId(batchId);
}

export { appendBlock, findBlocksByBatchId };

//Simlates a very basic append only block chain.

// {
//       "index": 1,
//       "timestamp": 1758347513004,
//       "type": "BATCH_CREATE",
//       "dataHash": "0x5b05857f16e310d746222f4210d04595fae21fe9c8dba748718cd4f6c02d237f",
//       "payload": {
//         "batchId": "joox3OUtxXgW",
//         "farmerId": "sR48DkZpJH"
//       },
//       "prevHash": "0x0",
//       "blockHash": "0x725210282f379661c5c07ab1d1a929f3be174ed4b8dc1ec36da885512b1e6446"
//     }

//Each block contains an index, timestamp, type (like BATCH_CREATE, BATCH_TRANSFER), dataHash (hash of the main data), payload (additional info like batchId, farmerId), prevHash (hash of the previous block) and blockHash (hash of the current block).

//In local db that is being used, the chain is stored as an array of blocks in db.data.chain.  The prev hash of the block, and the block idx etc are retrieved from this array only.

//Every trasaction that happens is appended as a new block to this chain. There is no concept of mining, difficulty etc. It is just a simple append only chain for the purpose of the MVP. There is no mempool of transactions either from which blocks are mined.

//Every time a new block is appended, the entire chain is not re-hashed. Only the new block is hashed using the sha256 function from the hash service. The prevHash of the new block is set to the blockHash of the last block in the chain.
