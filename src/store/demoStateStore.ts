import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DemoState {
  syncError: boolean;
  agentUnavailable: boolean;
  setSyncError: (v: boolean) => void;
  setAgentUnavailable: (v: boolean) => void;
  reset: () => void;
}

export const useDemoStateStore = create<DemoState>()(
  persist(
    (set) => ({
      syncError: false,
      agentUnavailable: false,
      setSyncError: (v) => set({ syncError: v }),
      setAgentUnavailable: (v) => set({ agentUnavailable: v }),
      reset: () => set({ syncError: false, agentUnavailable: false }),
    }),
    { name: "opc_demo_state" },
  ),
);
