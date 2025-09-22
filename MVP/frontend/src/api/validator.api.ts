import { makeHttpRequest } from "../apiHelper/httpReq";

// POST request to register a new farmer
export async function validateBatch(batchID : string): Promise<any> {
  const url = `/batches/${batchID}/verify`;
  return await makeHttpRequest(url, {
    method: "POST",
  });
}