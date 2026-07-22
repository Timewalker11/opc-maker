import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { TEAM_SIZE_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";

export function StepTeamSize() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const setAnswer = useOnboardingWizardStore((s) => s.setAnswer);

  return (
    <div>
      <p className="wizard-step__eyebrow">Getting to know your business</p>
      <h2 className="wizard-step__title">How many people work in your business?</h2>

      <div className="wizard-grid wizard-grid--cols-4">
        {TEAM_SIZE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            selected={answers.teamSize === opt.value}
            onClick={() => setAnswer("teamSize", opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
