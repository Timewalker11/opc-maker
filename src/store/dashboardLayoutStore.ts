import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardSize, DashboardCardConfig, DashboardCardId } from "../types";

const DEFAULT_LAYOUT: DashboardCardConfig[] = [
  { id: "revenue", visible: true, size: "lg" },
  { id: "tasks", visible: true, size: "md" },
  { id: "alerts", visible: true, size: "md" },
  { id: "customers", visible: true, size: "sm" },
  { id: "calendar", visible: true, size: "md" },
  { id: "emails", visible: true, size: "md" },
  { id: "social", visible: true, size: "sm" },
  { id: "storage", visible: true, size: "sm" },
];

interface DashboardLayoutState {
  cards: DashboardCardConfig[];
  customizing: boolean;
  setCustomizing: (v: boolean) => void;
  reorder: (fromId: DashboardCardId, toId: DashboardCardId) => void;
  toggleVisible: (id: DashboardCardId) => void;
  setSize: (id: DashboardCardId, size: CardSize) => void;
  restoreDefaults: () => void;
}

export const useDashboardLayoutStore = create<DashboardLayoutState>()(
  persist(
    (set) => ({
      cards: DEFAULT_LAYOUT,
      customizing: false,
      setCustomizing: (v) => set({ customizing: v }),
      reorder: (fromId, toId) =>
        set((state) => {
          const cards = [...state.cards];
          const fromIndex = cards.findIndex((c) => c.id === fromId);
          const toIndex = cards.findIndex((c) => c.id === toId);
          if (fromIndex === -1 || toIndex === -1) return state;
          const [moved] = cards.splice(fromIndex, 1);
          cards.splice(toIndex, 0, moved);
          return { cards };
        }),
      toggleVisible: (id) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
        })),
      setSize: (id, size) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, size } : c)),
        })),
      restoreDefaults: () => set({ cards: DEFAULT_LAYOUT, customizing: false }),
    }),
    { name: "opc_dashboard_layout" },
  ),
);
