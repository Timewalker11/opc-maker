import type { AppNotification } from "../types";
import { notifications } from "../mock/notifications";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/notifications
export function fetchNotifications(): Promise<AppNotification[]> {
  return mockRequest(notifications);
}
