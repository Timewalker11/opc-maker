import type { Recommendation } from "../types";
import { recommendations } from "../mock/recommendations";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/agent/recommendations
export function fetchRecommendations(): Promise<Recommendation[]> {
  return mockRequest(recommendations);
}
