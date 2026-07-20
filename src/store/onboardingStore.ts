import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingStep } from "../types";
import { onboardingSteps } from "../mock/onboarding";

interface OnboardingState {
  steps: OnboardingStep[];
  dismissed: boolean;
  toggleStep: (id: string) => void;
  dismiss: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      steps: onboardingSteps,
      dismissed: false,
      toggleStep: (id) =>
        set((s) => ({ steps: s.steps.map((step) => (step.id === id ? { ...step, done: !step.done } : step)) })),
      dismiss: () => set({ dismissed: true }),
    }),
    { name: "opc_onboarding_v2" },
  ),
);
