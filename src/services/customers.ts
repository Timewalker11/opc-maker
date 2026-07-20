import type { Customer } from "../types";
import { customers } from "../mock/customers";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/customers
export function fetchCustomers(): Promise<Customer[]> {
  return mockRequest(customers);
}

// Integration placeholder: GET /api/customers/new?window=7d
export function fetchNewCustomersThisWeek(): Promise<Customer[]> {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return mockRequest(customers.filter((c) => new Date(c.createdAt).getTime() > cutoff));
}

export interface NewCustomersSummary {
  thisWeek: number;
  lastWeek: number;
  topSource: string;
}

// Integration placeholder: GET /api/customers/new-summary
export function fetchNewCustomersSummary(): Promise<NewCustomersSummary> {
  const day = 24 * 60 * 60 * 1000;
  const thisWeekCutoff = Date.now() - 7 * day;
  const lastWeekCutoff = Date.now() - 14 * day;
  const thisWeek = customers.filter((c) => new Date(c.createdAt).getTime() > thisWeekCutoff).length;
  const lastWeek = customers.filter((c) => {
    const t = new Date(c.createdAt).getTime();
    return t <= thisWeekCutoff && t > lastWeekCutoff;
  }).length;

  const sourceCounts = new Map<string, number>();
  for (const c of customers) {
    sourceCounts.set(c.source, (sourceCounts.get(c.source) ?? 0) + 1);
  }
  const topSource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Direct";

  return mockRequest({ thisWeek, lastWeek: Math.max(lastWeek, 1), topSource });
}
