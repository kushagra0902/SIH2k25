import { makeHttpRequest } from "../apiHelper/httpReq";

// POST request to register a new farmer
export async function registerFarmerAPI(farmerName: string): Promise<any> {
  const url = `/auth/register`;
  const farmerData = JSON.stringify({ name: farmerName });
  return await makeHttpRequest(url, {
    method: "POST",
    body: farmerData
  });
}