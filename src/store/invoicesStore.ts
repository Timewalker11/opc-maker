import { create } from "zustand";
import type { Invoice } from "../types";
import { fetchInvoices } from "../services/invoices";

interface InvoicesState {
  items: Invoice[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

const DAY = 24 * 60 * 60 * 1000;

export const useInvoicesStore = create<InvoicesState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchInvoices();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () => {
    const now = Date.now();
    const items: Invoice[] = [
      { id: "inv_demo_1", customerName: "Marcus Webb", amount: 480, dueAt: new Date(now - 10 * DAY).toISOString(), status: "paid" },
      { id: "inv_demo_2", customerName: "Owen Fitzgerald", amount: 1250, dueAt: new Date(now - 3 * DAY).toISOString(), status: "overdue" },
      { id: "inv_demo_3", customerName: "Sofia Alvarez", amount: 320, dueAt: new Date(now + 5 * DAY).toISOString(), status: "pending" },
      { id: "inv_demo_4", customerName: "Priya Nair", amount: 640, dueAt: new Date(now - 20 * DAY).toISOString(), status: "paid" },
      { id: "inv_demo_5", customerName: "Hannah Kim", amount: 210, dueAt: new Date(now + 12 * DAY).toISOString(), status: "pending" },
    ];
    set({ items, status: "ready" });
  },
}));
