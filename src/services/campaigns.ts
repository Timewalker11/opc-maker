import type { Campaign } from "../types";
import { campaigns } from "../mock/campaigns";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/campaigns
export function fetchCampaigns(): Promise<Campaign[]> {
  return mockRequest(campaigns);
}
