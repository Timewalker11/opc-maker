import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardPanelsState {
  recommendationsCollapsed: boolean;
  activityCollapsed: boolean;
  toggleRecommendations: () => void;
  toggleActivity: () => void;
}

export const useDashboardPanelsStore = create<DashboardPanelsState>()(
  persist(
    (set) => ({
      recommendationsCollapsed: false,
      activityCollapsed: false,
      toggleRecommendations: () => set((s) => ({ recommendationsCollapsed: !s.recommendationsCollapsed })),
      toggleActivity: () => set((s) => ({ activityCollapsed: !s.activityCollapsed })),
    }),
    { name: "opc_dashboard_panels" },
  ),
);
