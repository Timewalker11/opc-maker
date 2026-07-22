import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingAnswers } from "../types";
import { MAX_STARTING_AGENTS } from "../mock/onboardingWizard";

export const TOTAL_STEPS = 10;

const EMPTY_ANSWERS: OnboardingAnswers = {
  companyName: "",
  businessType: null,
  businessDescription: "",
  sellTypes: [],
  teamSize: null,
  challenges: [],
  tools: [],
  otherTools: "",
  helpAreas: [],
  aiInvolvement: null,
  selectedAgents: [],
};

type ArrayAnswerKey = "sellTypes" | "challenges" | "tools" | "helpAreas" | "selectedAgents";

interface OnboardingWizardState {
  currentStep: number;
  answers: OnboardingAnswers;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  toggleArrayAnswer: (key: ArrayAnswerKey, value: string, cap?: number) => void;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export const useOnboardingWizardStore = create<OnboardingWizardState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: EMPTY_ANSWERS,
      setAnswer: (key, value) => set((s) => ({ answers: { ...s.answers, [key]: value } })),
      toggleArrayAnswer: (key, value, cap) =>
        set((s) => {
          const current = s.answers[key] as string[];
          const exists = current.includes(value);
          if (exists) {
            return { answers: { ...s.answers, [key]: current.filter((v) => v !== value) } };
          }
          if (cap && current.length >= cap) return s;
          return { answers: { ...s.answers, [key]: [...current, value] } };
        }),
      goNext: () => set({ currentStep: Math.min(get().currentStep + 1, TOTAL_STEPS - 1) }),
      goBack: () => set({ currentStep: Math.max(get().currentStep - 1, 0) }),
      goToStep: (step) => set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),
      reset: () => set({ currentStep: 0, answers: EMPTY_ANSWERS }),
    }),
    { name: "opc_onboarding_wizard" },
  ),
);

// Whether the wizard can move forward from a given step. Single-select "identity" steps
// (business type, team size, AI involvement, starting agents) require a choice; the softer
// exploratory multi-select steps (sell types, challenges, tools, help areas) are always
// skippable so the flow never blocks on a question the owner would rather not answer yet.
export function canContinueFromStep(step: number, answers: OnboardingAnswers): boolean {
  switch (step) {
    case 0:
      return true;
    case 1:
      if (!answers.companyName.trim() || !answers.businessType) return false;
      if (answers.businessType === "other" && !answers.businessDescription.trim()) return false;
      return true;
    case 2:
      return answers.sellTypes.length > 0;
    case 3:
      return answers.teamSize !== null;
    case 4:
      return true;
    case 5:
      return true;
    case 6:
      return true;
    case 7:
      return answers.aiInvolvement !== null;
    case 8:
      return answers.selectedAgents.length > 0 && answers.selectedAgents.length <= MAX_STARTING_AGENTS;
    case 9:
      return true;
    default:
      return true;
  }
}
