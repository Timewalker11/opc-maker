import type { AlertItem } from "../types";
import { alerts } from "../mock/alerts";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/alerts
export function fetchAlerts(): Promise<AlertItem[]> {
  return mockRequest(alerts);
}
