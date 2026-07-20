import type { CalendarEvent } from "../types";
import { calendarEvents } from "../mock/calendar";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/calendar/events?range=upcoming
export function fetchUpcomingEvents(): Promise<CalendarEvent[]> {
  return mockRequest(calendarEvents);
}
