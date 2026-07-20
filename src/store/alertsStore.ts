import { create } from "zustand";
import type { AlertItem } from "../types";
import { fetchAlerts } from "../services/alerts";
import { useAgentStore } from "./agentStore";

interface AlertsState {
  items: AlertItem[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  resolve: (id: string) => void;
}

export const useAlertsStore = create<AlertsState>()((set, get) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchAlerts();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  resolve: (id) => {
    const alert = get().items.find((a) => a.id === id);
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, resolved: true } : a)) }));
    if (alert) useAgentStore.getState().logActivity(`Resolved alert: ${alert.title}`, false);
  },
}));
