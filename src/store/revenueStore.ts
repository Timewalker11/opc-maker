import { create } from "zustand";
import { fetchRevenueSummary } from "../services/analytics";

interface RevenueState {
  currentMonth: number;
  previousMonth: number;
  goal: number;
  trend: number[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

export const useRevenueStore = create<RevenueState>()((set) => ({
  currentMonth: 0,
  previousMonth: 0,
  goal: 0,
  trend: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const data = await fetchRevenueSummary();
      set({ ...data, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () =>
    set({
      currentMonth: 18400,
      previousMonth: 15200,
      goal: 25000,
      trend: [9800, 11200, 12500, 14100, 15200, 18400],
      status: "ready",
    }),
}));
