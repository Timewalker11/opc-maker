import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { ProgressBar } from "../ui/ProgressBar";
import { useOnboardingStore } from "../../store/onboardingStore";
import "./onboarding-checklist.css";

export function OnboardingChecklist() {
  const steps = useOnboardingStore((s) => s.steps);
  const dismissed = useOnboardingStore((s) => s.dismissed);
  const toggleStep = useOnboardingStore((s) => s.toggleStep);
  const dismiss = useOnboardingStore((s) => s.dismiss);

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  if (dismissed || pct === 100) return null;

  return (
    <Card
      className="onboarding-checklist"
      title="Finish setting up your business"
      subtitle={`${pct}% complete -- ${steps.length - doneCount} steps left`}
      icon={<Icon name="sparkles" size={16} />}
      headerAction={
        <button className="onboarding-checklist__dismiss" onClick={dismiss} aria-label="Dismiss setup checklist">
          <Icon name="x" size={15} />
        </button>
      }
    >
      <ProgressBar value={pct} label="Setup progress" />
      <ul className="onboarding-checklist__list">
        {steps.map((step) => (
          <li key={step.id} className="onboarding-checklist__item">
            <label className="onboarding-checklist__label">
              <input type="checkbox" checked={step.done} onChange={() => toggleStep(step.id)} />
              <span className={step.done ? "onboarding-checklist__text--done" : ""}>{step.label}</span>
            </label>
            {!step.done && (
              <Link to={step.href} className="card-link">
                Go <Icon name="chevron-right" size={12} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
