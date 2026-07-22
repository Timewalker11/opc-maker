import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { WizardShell } from "../components/onboarding/wizard/WizardShell";
import { StepWelcome } from "../components/onboarding/wizard/StepWelcome";
import { StepBusinessType } from "../components/onboarding/wizard/StepBusinessType";
import { StepSell } from "../components/onboarding/wizard/StepSell";
import { StepTeamSize } from "../components/onboarding/wizard/StepTeamSize";
import { StepChallenges } from "../components/onboarding/wizard/StepChallenges";
import { StepTools } from "../components/onboarding/wizard/StepTools";
import { StepHelp } from "../components/onboarding/wizard/StepHelp";
import { StepAIInvolvement } from "../components/onboarding/wizard/StepAIInvolvement";
import { StepAITeam } from "../components/onboarding/wizard/StepAITeam";
import { StepBuilding } from "../components/onboarding/wizard/StepBuilding";
import { useOnboardingWizardStore, canContinueFromStep, TOTAL_STEPS } from "../store/onboardingWizardStore";
import { useAuthStore } from "../store/authStore";
import { useBusinessProfileStore } from "../store/businessProfileStore";
import { useDashboardLayoutStore } from "../store/dashboardLayoutStore";
import { useAgentSelectionStore } from "../store/agentSelectionStore";
import { useRecommendationsStore } from "../store/recommendationsStore";
import { computeDashboardLayout, computeStarterRecommendations } from "../utils/personalization";

const WIDE_STEPS = new Set([1, 4, 5, 8]);

export function Onboarding() {
  const currentStep = useOnboardingWizardStore((s) => s.currentStep);
  const answers = useOnboardingWizardStore((s) => s.answers);
  const goNext = useOnboardingWizardStore((s) => s.goNext);
  const goBack = useOnboardingWizardStore((s) => s.goBack);

  const authUser = useAuthStore((s) => s.user);
  const setProfile = useBusinessProfileStore((s) => s.setProfile);
  const setLayout = useDashboardLayoutStore((s) => s.setLayout);
  const setActiveAgents = useAgentSelectionStore((s) => s.setActiveAgents);
  const seedRecommendations = useRecommendationsStore((s) => s.seed);
  const navigate = useNavigate();

  const [finishError, setFinishError] = useState<string | null>(null);

  async function handleFinish() {
    setFinishError(null);
    const ok = await setProfile({
      companyName: answers.companyName.trim(),
      businessType: answers.businessType ?? "other",
      referralSource: "other",
      ownerName: authUser?.name ?? "",
    });
    if (!ok) {
      setFinishError("Couldn't save your workspace. Please try again.");
      return;
    }
    setActiveAgents(answers.selectedAgents);
    setLayout(computeDashboardLayout(answers));
    seedRecommendations(computeStarterRecommendations(answers));
    navigate("/", { replace: true });
  }

  if (currentStep === TOTAL_STEPS - 1) {
    return (
      <div className="wizard-page">
        <div className="wizard-shell">
          <div className="wizard-step">
            <StepBuilding onFinish={handleFinish} />
            {finishError && <p className="auth-form__error">{finishError}</p>}
          </div>
        </div>
      </div>
    );
  }

  const canContinue = canContinueFromStep(currentStep, answers);
  const continueLabel = currentStep === 0 ? "Get Started" : currentStep === TOTAL_STEPS - 2 ? "Build my workspace" : "Continue";

  return (
    <WizardShell
      stepIndex={currentStep}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      onContinue={goNext}
      canContinue={canContinue}
      continueLabel={continueLabel}
      continueIcon={<Icon name="chevron-right" size={15} />}
      showBack={currentStep > 0}
      wide={WIDE_STEPS.has(currentStep)}
    >
      {currentStep === 0 && <StepWelcome />}
      {currentStep === 1 && <StepBusinessType />}
      {currentStep === 2 && <StepSell />}
      {currentStep === 3 && <StepTeamSize />}
      {currentStep === 4 && <StepChallenges />}
      {currentStep === 5 && <StepTools />}
      {currentStep === 6 && <StepHelp />}
      {currentStep === 7 && <StepAIInvolvement />}
      {currentStep === 8 && <StepAITeam />}
    </WizardShell>
  );
}
