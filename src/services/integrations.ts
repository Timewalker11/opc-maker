import type { Integration } from "../types";
import { integrations } from "../mock/integrations";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/integrations
export function fetchIntegrations(): Promise<Integration[]> {
  return mockRequest(integrations);
}
