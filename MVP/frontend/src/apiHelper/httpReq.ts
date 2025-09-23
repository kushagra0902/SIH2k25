const API_BASE_URL = "http://10.24.0.198:4000/api"; // Replace with your server URL

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Generic function to make HTTP requests
export async function makeHttpRequest(url: string, options: RequestOptions = {}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}