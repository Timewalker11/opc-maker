import { API_BASE_URL } from "../config";
import { authHeaders } from "./authToken";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

// The real HTTP path -- used by services backed by the actual server (auth, business profile,
// integrations). Domains still on mock data use mockRequest/mockFailure below instead.
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error ?? "Something went wrong.", res.status);
  }
  return body as T;
}

interface MockOptions {
  latencyMs?: number;
}

const DEFAULT_LATENCY_MS = 380;

/**
 * Stands in for a real HTTP call while the backend doesn't exist yet.
 * Every service function funnels through here so swapping in `fetch(path, { headers: authHeaders() })`
 * later is a one-line change per function, not a rewrite.
 */
export function mockRequest<T>(data: T, { latencyMs = DEFAULT_LATENCY_MS }: MockOptions = {}): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), latencyMs);
  });
}

export function mockFailure(message: string, status = 500, latencyMs = DEFAULT_LATENCY_MS): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(message, status)), latencyMs);
  });
}
