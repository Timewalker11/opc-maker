import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { BUSINESS_TYPE_OPTIONS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";

export function StepBusinessType() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const setAnswer = useOnboardingWizardStore((s) => s.setAnswer);

  return (
    <div>
      <p className="wizard-step__eyebrow">Getting to know your business</p>
      <h2 className="wizard-step__title">What kind of business do you run?</h2>

      <div className="wizard-step__field">
        <label htmlFor="companyName">What's it called?</label>
        <input
          id="companyName"
          type="text"
          autoFocus
          placeholder="Your business name"
          value={answers.companyName}
          onChange={(e) => setAnswer("companyName", e.target.value)}
        />
      </div>

      <div className="wizard-grid wizard-grid--cols-4">
        {BUSINESS_TYPE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            size="sm"
            selected={answers.businessType === opt.value}
            onClick={() => setAnswer("businessType", opt.value)}
          />
        ))}
      </div>

      {answers.businessType === "other" && (
        <div className="wizard-step__field">
          <label htmlFor="businessDescription">Describe your business</label>
          <input
            id="businessDescription"
            type="text"
            autoFocus
            placeholder="Tell us what you do"
            value={answers.businessDescription}
            onChange={(e) => setAnswer("businessDescription", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
