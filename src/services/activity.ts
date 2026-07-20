import type { ActivityEvent } from "../types";
import { activity } from "../mock/activity";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/activity?limit=20
export function fetchActivity(): Promise<ActivityEvent[]> {
  return mockRequest(activity);
}
