// FILE: lib/api/client.ts
// This file creates a reusable API client for your app.
// It handles: base URL, headers, authentication, error handling, and HTTP methods.

// Base URL for your backend API
// IMPORTANT: Must be set via NEXT_PUBLIC_API_BASE_URL environment variable
// The NEXT_PUBLIC_ prefix makes it accessible in browser code
// Examples:
//   - Local dev (.env.local): NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
//   - Docker (compose): Build arg NEXT_PUBLIC_API_BASE_URL=http://47.237.167.215:3000
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Custom error class to provide better error information
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Builds the request headers for every API call.
 * Adds JSON content type and attaches the Authorization header
 * if a JWT access token exists.
 */
function buildHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  return headers;
}

/**
 * Handles an API response:
 * - Reads the response body safely (JSON or text)
 * - Throws an ApiError if the request failed
 * - Returns the parsed data if successful
 */
async function handleResponse<T>(response: Response): Promise<T> {
  let payload: any = null;

  // Read response body as text first (safer than .json())
  const text = await response.text();

  // Try to parse JSON response
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text; // Fallback for non-JSON responses
    }
  }

  // If request failed, throw custom ApiError with useful details
  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error)) ||
      `Request failed with ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  // Success → return parsed data
  return payload as T;
}

/**
 * GET request
 * For fetching data: apiGet("/categories")
 */
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: buildHeaders(),
  });
  console.log("headers:", buildHeaders());
  console.log("API GET Response:", response);
  return handleResponse<T>(response);
}
