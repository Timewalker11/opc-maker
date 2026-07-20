export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
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
