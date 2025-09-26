import { makeHttpRequest } from "../apiHelper/httpReq";

// // Interface for batch data
// export interface BatchData {
//   id?: string;
//   farmerId: string;
//   cropType: string;
//   quantity?: number;
//   harvestDate?: string;
//   location?: string;
//   [key: string]: any; // Allow additional properties
// }

// // Interface for API response
// export interface BatchResponse {
//   id: string;
//   farmerId: string;
//   cropType: string;
//   quantity?: number;
//   harvestDate?: string;
//   location?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   [key: string]: any;
// }

// Export the createBatch function

// Promise<BatchResponse>
export async function createBatch(formData: FormData)  {
  const url = `/batches/create`;
  try {
    const response = await fetch(`https://sih2k25-cdy3.onrender.com/api${url}`, {
      method: "POST",
      body: formData, // FormData for file uploads
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
}

// // Export the getBatches function
// export async function getBatches(): Promise<BatchResponse[]> {
//   const url = `/batches`;
//   return await makeHttpRequest(url, {
//     method: "GET",
//   });
// }

// // Additional utility functions
// export async function getBatchById(batchId: string): Promise<BatchResponse> {
//   const url = `/batches/${batchId}`;
//   return await makeHttpRequest(url, {
//     method: "GET",
//   });
// }

// export async function updateBatch(
//   batchId: string,
//   batchData: Partial<BatchData>
// ): Promise<BatchResponse> {
//   const url = `/batches/${batchId}`;
//   return await makeHttpRequest(url, {
//     method: "PUT",
//     body: JSON.stringify(batchData),
//   });
// }

// export async function deleteBatch(
//   batchId: string
// ): Promise<{ success: boolean; message?: string }> {
//   const url = `/batches/${batchId}`;
//   return await makeHttpRequest(url, {
//     method: "DELETE",
//   });
// }
