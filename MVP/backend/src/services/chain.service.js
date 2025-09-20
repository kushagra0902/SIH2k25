import { getDB } from '../db/db.js';
import { sha256 } from './hash.service.js';

// Very simple append-only chain (no mining) for MVP
async function appendBlock({ type, dataHash, payload = {} }){
  const db = await getDB();
  const chain = db.data.chain;
  const prev = chain.length ? chain[chain.length - 1].blockHash : '0x0';
  const block = {
    index: chain.length + 1,
    timestamp: Date.now(),
    type,
    dataHash,
    payload,
    prevHash: prev
  };
  block.blockHash = sha256(block);
  chain.push(block);
  await db.write();
  return block;
}

async function findBlocksByBatchId(batchId){
  const db = await getDB();
  return db.data.chain.filter(b => (b.payload && b.payload.batchId) === batchId); // uses a simple array filter
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