import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { HELP_AREA_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";

export function StepHelp() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const toggleArrayAnswer = useOnboardingWizardStore((s) => s.toggleArrayAnswer);

  return (
    <div>
      <p className="wizard-step__eyebrow">Priorities</p>
      <h2 className="wizard-step__title">What would you like help with first?</h2>
      <p className="wizard-step__subtitle">Choose all that apply.</p>

      <div className="wizard-grid wizard-grid--cols-2">
        {HELP_AREA_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            selected={answers.helpAreas.includes(opt.value)}
            onClick={() => toggleArrayAnswer("helpAreas", opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
