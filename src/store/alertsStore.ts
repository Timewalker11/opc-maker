import { create } from "zustand";
import type { AlertItem } from "../types";
import { fetchAlerts } from "../services/alerts";
import { useAgentStore } from "./agentStore";

interface AlertsState {
  items: AlertItem[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  resolve: (id: string) => void;
  seedDemo: () => void;
}

const HOUR = 60 * 60 * 1000;

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
  seedDemo: () => {
    const now = Date.now();
    const items: AlertItem[] = [
      {
        id: "alert_demo_1",
        severity: "warning",
        title: "Gmail connection expiring soon",
        description: "Your Gmail token will expire in 2 days -- reconnect to avoid an interruption.",
        detectedAt: new Date(now - 3 * HOUR).toISOString(),
        recommendedAction: "Reconnect Gmail from Integrations.",
        actionLabel: "Reconnect",
        resolved: false,
      },
      {
        id: "alert_demo_2",
        severity: "serious",
        title: "Overdue invoice from Owen Fitzgerald",
        description: "Invoice for $1,250 is 3 days past due.",
        detectedAt: new Date(now - 8 * HOUR).toISOString(),
        recommendedAction: "Send a payment reminder.",
        actionLabel: "Send reminder",
        resolved: false,
      },
      {
        id: "alert_demo_3",
        severity: "info",
        title: "Storage usage climbing",
        description: "You've used 23% of your storage this month.",
        detectedAt: new Date(now - 20 * HOUR).toISOString(),
        recommendedAction: "No action needed yet.",
        actionLabel: "View files",
        resolved: false,
      },
    ];
    set({ items, status: "ready" });
  },
}));
