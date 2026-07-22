import { create } from "zustand";
import type { Order } from "../types";
import { fetchOrders } from "../services/orders";

interface OrdersState {
  items: Order[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

const DAY = 24 * 60 * 60 * 1000;

export const useOrdersStore = create<OrdersState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchOrders();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () => {
    const now = Date.now();
    const items: Order[] = [
      { id: "order_demo_1", customerName: "Hannah Kim", amount: 210, createdAt: new Date(now - 1 * DAY).toISOString(), source: "Shopify" },
      { id: "order_demo_2", customerName: "Priya Nair", amount: 145, createdAt: new Date(now - 2 * DAY).toISOString(), source: "Instagram" },
      { id: "order_demo_3", customerName: "Marcus Webb", amount: 480, createdAt: new Date(now - 5 * DAY).toISOString(), source: "Shopify" },
      { id: "order_demo_4", customerName: "Daniel Osei", amount: 95, createdAt: new Date(now - 6 * DAY).toISOString(), source: "Google" },
      { id: "order_demo_5", customerName: "Owen Fitzgerald", amount: 625, createdAt: new Date(now - 9 * DAY).toISOString(), source: "Direct" },
    ];
    set({ items, status: "ready" });
  },
}));
