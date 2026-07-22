import type { Invoice } from "../types";
import { invoices } from "../mock/invoices";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/invoices
export function fetchInvoices(): Promise<Invoice[]> {
  return mockRequest(invoices);
}
