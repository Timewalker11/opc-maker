import { create } from "zustand";
import type { Customer } from "../types";
import { fetchCustomers } from "../services/customers";

interface CustomersState {
  items: Customer[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

const DAY = 24 * 60 * 60 * 1000;

export const useCustomersStore = create<CustomersState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchCustomers();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () => {
    const now = Date.now();
    const items: Customer[] = [
      {
        id: "demo_cust_1",
        name: "Priya Nair",
        email: "priya@brightloomstudio.com",
        source: "Instagram",
        createdAt: new Date(now - 2 * DAY).toISOString(),
        lifetimeValue: 640,
        lastPurchaseAt: new Date(now - 2 * DAY).toISOString(),
        tags: ["Repeat buyer"],
      },
      {
        id: "demo_cust_2",
        name: "Marcus Webb",
        email: "marcus.webb@gmail.com",
        source: "Shopify",
        createdAt: new Date(now - 5 * DAY).toISOString(),
        lifetimeValue: 1280,
        lastPurchaseAt: new Date(now - 5 * DAY).toISOString(),
        tags: ["VIP"],
      },
      {
        id: "demo_cust_3",
        name: "Sofia Alvarez",
        email: "sofia.alvarez@outlook.com",
        source: "Referral",
        createdAt: new Date(now - 9 * DAY).toISOString(),
        lifetimeValue: 320,
        lastPurchaseAt: new Date(now - 20 * DAY).toISOString(),
        tags: [],
      },
      {
        id: "demo_cust_4",
        name: "Daniel Osei",
        email: "daniel.osei@yahoo.com",
        source: "Google",
        createdAt: new Date(now - 16 * DAY).toISOString(),
        lifetimeValue: 95,
        lastPurchaseAt: null,
        tags: ["New"],
      },
      {
        id: "demo_cust_5",
        name: "Hannah Kim",
        email: "hannah.kim@icloud.com",
        source: "Direct",
        createdAt: new Date(now - 1 * DAY).toISOString(),
        lifetimeValue: 210,
        lastPurchaseAt: new Date(now - 1 * DAY).toISOString(),
        tags: ["Repeat buyer"],
      },
      {
        id: "demo_cust_6",
        name: "Owen Fitzgerald",
        email: "owen.fitz@proton.me",
        source: "Shopify",
        createdAt: new Date(now - 30 * DAY).toISOString(),
        lifetimeValue: 1875,
        lastPurchaseAt: new Date(now - 45 * DAY).toISOString(),
        tags: ["VIP", "At risk"],
      },
    ];
    set({ items, status: "ready" });
  },
}));
