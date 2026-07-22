import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { SELL_TYPE_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";

export function StepSell() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const toggleArrayAnswer = useOnboardingWizardStore((s) => s.toggleArrayAnswer);

  return (
    <div>
      <p className="wizard-step__eyebrow">Getting to know your business</p>
      <h2 className="wizard-step__title">What does your business primarily sell?</h2>
      <p className="wizard-step__subtitle">Choose all that apply.</p>

      <div className="wizard-grid">
        {SELL_TYPE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            selected={answers.sellTypes.includes(opt.value)}
            onClick={() => toggleArrayAnswer("sellTypes", opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
