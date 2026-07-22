import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingStep } from "../types";
import { onboardingSteps } from "../mock/onboarding";

interface OnboardingState {
  steps: OnboardingStep[];
  collapsed: boolean;
  toggleStep: (id: string) => void;
  toggleCollapsed: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      steps: onboardingSteps,
      collapsed: false,
      toggleStep: (id) =>
        set((s) => ({ steps: s.steps.map((step) => (step.id === id ? { ...step, done: !step.done } : step)) })),
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
    }),
    { name: "opc_onboarding_v2" },
  ),
);
