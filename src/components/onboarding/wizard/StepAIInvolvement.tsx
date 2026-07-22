import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { AI_INVOLVEMENT_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";
import { Icon } from "../../ui/Icon";

export function StepAIInvolvement() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const setAnswer = useOnboardingWizardStore((s) => s.setAnswer);

  return (
    <div>
      <p className="wizard-step__eyebrow">How your AI team works</p>
      <h2 className="wizard-step__title">How involved should AI be?</h2>

      <div className="wizard-stack">
        {AI_INVOLVEMENT_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.name}
            description={opt.description}
            size="lg"
            selected={answers.aiInvolvement === opt.value}
            onClick={() => setAnswer("aiInvolvement", opt.value)}
          />
        ))}
      </div>

      <p className="wizard-step__note">
        <Icon name="shield" size={15} />
        You remain in control. Sensitive actions always require your approval.
      </p>
    </div>
  );
}
