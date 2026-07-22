import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Plan = "free" | "premium";

interface PlanState {
  plan: Plan;
  setPlan: (plan: Plan) => void;
}

// No real billing integration yet -- upgrading just flips this locally, same as the rest of
// the app's demo-data-driven state, so the free-tier agent limit has something real to check.
export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plan: "free",
      setPlan: (plan) => set({ plan }),
    }),
    { name: "opc_plan" },
  ),
);
