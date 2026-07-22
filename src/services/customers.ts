import type { Customer } from "../types";
import { customers } from "../mock/customers";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/customers
export function fetchCustomers(): Promise<Customer[]> {
  return mockRequest(customers);
}
