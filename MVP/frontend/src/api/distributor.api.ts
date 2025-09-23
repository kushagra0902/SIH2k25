import { makeHttpRequest } from "../apiHelper/httpReq";

// POST request to register a new farmer
export async function purchaseBatch(batchID : string): Promise<any> {
  const url = `/batches/${batchID}/transfer`;
  return await makeHttpRequest(url, {
    method: "POST",
    body: JSON.stringify({ to : "DistributorABC" }),
  });
}