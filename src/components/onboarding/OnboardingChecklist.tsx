import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { ProgressBar } from "../ui/ProgressBar";
import { useOnboardingStore } from "../../store/onboardingStore";
import "./onboarding-checklist.css";

export function OnboardingChecklist() {
  const steps = useOnboardingStore((s) => s.steps);
  const collapsed = useOnboardingStore((s) => s.collapsed);
  const toggleStep = useOnboardingStore((s) => s.toggleStep);
  const toggleCollapsed = useOnboardingStore((s) => s.toggleCollapsed);

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  if (pct === 100) return null;

  return (
    <Card
      className="onboarding-checklist"
      title="Finish setting up your business"
      subtitle={`${pct}% complete -- ${steps.length - doneCount} steps left`}
      icon={<Icon name="sparkles" size={16} />}
      headerAction={
        <button
          className="onboarding-checklist__icon-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand setup checklist" : "Shrink setup checklist"}
          aria-expanded={!collapsed}
        >
          <Icon name={collapsed ? "chevron-down" : "chevron-up"} size={15} />
        </button>
      }
    >
      <ProgressBar value={pct} label="Setup progress" />
      {!collapsed && (
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
      )}
    </Card>
  );
}
