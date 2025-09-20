import fs from "fs/promises";
//this module let us use filesync but in a easier API like level. We dont have to use callbacks and all that. We can use async await.
import path from "path";
import { storageDir } from "../config.js";

async function ensureStorage() {
  await fs.mkdir(storageDir, { recursive: true }); // recursive means if the parent folder does not exist, create it too.
}

async function saveFile(buffer, filename) {
  await ensureStorage();
  const filePath = path.join(storageDir, filename);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

export { ensureStorage, saveFile };


//This module helps us to save files to the storage directory. It ensures that the storage directory exists and then saves the file with the given filename and buffer. It returns the path of the saved file.

//All the photos, reports given by validator, kyc docs, photos etc are saved using this module.