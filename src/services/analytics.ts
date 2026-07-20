import { business } from "../mock/business";
import { mockRequest } from "./apiClient";

export interface RevenueSummary {
  currentMonth: number;
  previousMonth: number;
  goal: number;
  trend: number[];
}

// Integration placeholder: GET /api/analytics/revenue?range=month
export function fetchRevenueSummary(): Promise<RevenueSummary> {
  return mockRequest({
    currentMonth: business.revenueThisMonth,
    previousMonth: business.revenuePrevMonth,
    goal: business.revenueGoal,
    trend: business.revenueTrend,
  });
}
