import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { ProgressBar } from "../ui/ProgressBar";
import { useOnboardingStore } from "../../store/onboardingStore";
import { useBusinessProfileStore } from "../../store/businessProfileStore";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchIntegrations } from "../../services/integrationsApi";
import "./onboarding-checklist.css";

// These steps mirror real server-side state, so their "done" status is derived live from the
// business profile / integrations APIs on every render instead of the manually-toggled
// checkbox in onboardingStore. Otherwise a step (e.g. "Connect email") stays checked off as
// incomplete forever after the owner actually finishes the real OAuth flow, since nothing
// about connecting an integration ever touched the checklist's own local/persisted state.
const AUTO_DERIVED_STEP_IDS = new Set(["profile", "email", "calendar", "payments"]);

export function OnboardingChecklist() {
  const steps = useOnboardingStore((s) => s.steps);
  const collapsed = useOnboardingStore((s) => s.collapsed);
  const toggleStep = useOnboardingStore((s) => s.toggleStep);
  const toggleCollapsed = useOnboardingStore((s) => s.toggleCollapsed);

  const isProfileComplete = useBusinessProfileStore((s) => s.isComplete);
  const { data: integrationsData } = useDashboardData(fetchIntegrations);
  const connectedProviders = new Set((integrationsData?.integrations ?? []).filter((i) => i.connected).map((i) => i.id));

  const resolvedSteps = steps.map((step) => {
    switch (step.id) {
      case "profile":
        return { ...step, done: isProfileComplete };
      case "email":
      case "calendar":
        return { ...step, done: connectedProviders.has("google") };
      case "payments":
        return { ...step, done: connectedProviders.has("shopify") };
      default:
        return step;
    }
  });

  const doneCount = resolvedSteps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / resolvedSteps.length) * 100);

  if (pct === 100) return null;

  return (
    <Card
      className="onboarding-checklist"
      title="Finish setting up your business"
      subtitle={`${pct}% complete -- ${resolvedSteps.length - doneCount} steps left`}
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
          {resolvedSteps.map((step) => (
            <li key={step.id} className="onboarding-checklist__item">
              <label className="onboarding-checklist__label">
                <input
                  type="checkbox"
                  checked={step.done}
                  disabled={AUTO_DERIVED_STEP_IDS.has(step.id)}
                  onChange={() => toggleStep(step.id)}
                />
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
