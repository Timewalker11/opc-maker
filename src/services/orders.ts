import type { Order } from "../types";
import { orders } from "../mock/orders";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/orders
export function fetchOrders(): Promise<Order[]> {
  return mockRequest(orders);
}
