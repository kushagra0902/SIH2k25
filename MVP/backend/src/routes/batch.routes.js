import express from 'express';
import upload from '../middleware/upload.js';
import { saveFile } from '../utils/fileHelpers.js';
import { sha256 } from '../services/hash.service.js';
import { generateDataUrl } from '../services/qr.service.js';
import { createBatch, getBatch, updateBatch } from '../models/batch.model.js';
import { appendBlock } from '../services/chain.service.js';
import path from 'path';
const router = express.Router();

router.post('/create', upload.array('photos', 4), async (req, res, next) => {
    //upload multer middleware processes the incoming request and handles file uploads. It looks for files in the 'photos' field of the form data, allowing up to 4 files. The uploaded files are stored in memory and made available in req.files for further processing in the route handler.
  try {
    const { farmerId, crop, quantity, harvestDate, geo } = req.body;
    // Save uploaded files
    const photos = [];
    //makes teh array of photos to be saved. If there are any files in the req.files array (set by multer), it iterates over each file, generates a unique filename using the current timestamp and the original filename, saves the file using the saveFile function, and stores the file path in the photos array.
    if(req.files && req.files.length){
      for(const f of req.files){
        const filename = `${Date.now()}_${f.originalname}`;
        const filePath = path.basename(await saveFile(f.buffer, filename));
        photos.push(filePath);
      }
    }
    const metadata = { crop, quantity, harvestDate, geo, photos };
    const metadataHash = sha256(metadata);
    //creates teh batch obj and save it in the db.json file(lowDB)
    const batch = await createBatch({ farmerId, metadata, metadataHash, photos });
    // append to simulated chain
    //append this batch creation to the blockchain as a transaction with batch create type and relevant data
    const block = await appendBlock({ type: 'BATCH_CREATE', dataHash: metadataHash, payload: { batchId: batch.id, farmerId } });
    // generate QR that contains batch id
    const qr = await generateDataUrl(`batch:${batch.id}`);
    //generates the QR code that encodes the batch id using the generateDataUrl function from the qr service. This QR code can be used for easy identification and tracking of the batch.
    res.json({ ok: true, batch, block, qr });
  } catch (err) { next(err); }
});

router.get('/:batchId', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await getBatch(batchId);
    if(!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });
    res.json({ ok: true, batch });
  } catch (err) { next(err); }
});

router.post('/:batchId/verify', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await getBatch(batchId);
    if(!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });
    const recomputed = sha256(batch.metadata);
    const ok = recomputed === batch.metadataHash;
    res.json({ ok: true, verified: ok, recomputed, metadataHash: batch.metadataHash });
  } catch (err) { next(err); }
});

router.post('/:batchId/transfer', async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { to } = req.body; // to = distributor id (for MVP)
    const batch = await getBatch(batchId);
    if(!batch) return res.status(404).json({ ok: false, error: 'Batch not found' });
    // update owner
    await updateBatch(batchId, { currentOwner: to, status: 'IN_TRANSIT' });
    const block = await appendBlock({ type: 'TRANSFER', dataHash: sha256({ batchId, to }), payload: { batchId, to } });
    res.json({ ok: true, block });
  } catch (err) { next(err); }
});

export default router;
