import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { CHALLENGE_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";
import { Icon } from "../../ui/Icon";

export function StepChallenges() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const toggleArrayAnswer = useOnboardingWizardStore((s) => s.toggleArrayAnswer);

  const selected = CHALLENGE_OPTIONS.filter((opt) => answers.challenges.includes(opt.value));

  return (
    <div>
      <p className="wizard-step__eyebrow">Where it's slowing you down</p>
      <h2 className="wizard-step__title">What are your biggest challenges today?</h2>
      <p className="wizard-step__subtitle">Choose all that apply -- there's no wrong answer.</p>

      <div className="wizard-grid wizard-grid--cols-4">
        {CHALLENGE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            size="sm"
            selected={answers.challenges.includes(opt.value)}
            onClick={() => toggleArrayAnswer("challenges", opt.value)}
          />
        ))}
      </div>

      {selected.length > 0 && (
        <div className="wizard-chip-row">
          {selected.map((opt) => (
            <span key={opt.value} className="wizard-chip">
              {opt.label}
              <button type="button" onClick={() => toggleArrayAnswer("challenges", opt.value)} aria-label={`Remove ${opt.label}`}>
                <Icon name="x" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
