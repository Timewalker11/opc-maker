import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { Modal } from "../components/ui/Modal";
import { OnboardingChecklist } from "../components/onboarding/OnboardingChecklist";
import { AgentsSection } from "../components/settings/AgentsSection";
import { IntegrationsSection } from "../components/settings/IntegrationsSection";
import { useDashboardLayoutStore } from "../store/dashboardLayoutStore";
import { useDemoStateStore } from "../store/demoStateStore";
import { seedDemoData } from "../utils/seedDemoData";
import { useAuthStore } from "../store/authStore";
import { useBusinessProfileStore } from "../store/businessProfileStore";
import { usePlanStore } from "../store/planStore";
import { REFERRAL_SOURCES } from "../mock/onboardingOptions";
import { BUSINESS_TYPE_OPTIONS, MAX_STARTING_AGENTS as FREE_PLAN_AGENT_LIMIT } from "../mock/onboardingWizard";
import "./settings.css";

export function Settings() {
  const location = useLocation();
  const restoreDefaults = useDashboardLayoutStore((s) => s.restoreDefaults);
  const syncError = useDemoStateStore((s) => s.syncError);
  const setSyncError = useDemoStateStore((s) => s.setSyncError);
  const agentUnavailable = useDemoStateStore((s) => s.agentUnavailable);
  const setAgentUnavailable = useDemoStateStore((s) => s.setAgentUnavailable);
  const user = useAuthStore((s) => s.user);
  const profile = useBusinessProfileStore((s) => s.profile);
  const plan = usePlanStore((s) => s.plan);
  const setPlan = usePlanStore((s) => s.setPlan);

  const businessTypeLabel = BUSINESS_TYPE_OPTIONS.find((t) => t.value === profile?.businessType)?.label;
  const referralSourceLabel = REFERRAL_SOURCES.find((r) => r.value === profile?.referralSource)?.label;

  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [demoDataGenerated, setDemoDataGenerated] = useState(false);

  function handleGenerateDemoData() {
    seedDemoData();
    setDemoDataGenerated(true);
  }

  // Deep links from elsewhere in the app (e.g. "Connect Gmail") point at /settings#integrations
  // or /settings#agents -- open the matching popup instead of landing on the plain page.
  useEffect(() => {
    if (location.hash === "#integrations") setIntegrationsOpen(true);
    if (location.hash === "#agents") setAgentsOpen(true);
  }, [location.hash]);

  return (
    <div>
      <PageHeader title="Settings" description="Business profile, dashboard preferences, and account settings." />

      <Card title="Business profile">
        <div className="settings-field-grid">
          <div className="settings-field">
            <span className="settings-field__label">Business name</span>
            <span className="settings-field__value">{profile?.companyName ?? "—"}</span>
          </div>
          <div className="settings-field">
            <span className="settings-field__label">Business type</span>
            <span className="settings-field__value">{businessTypeLabel ?? "—"}</span>
          </div>
          <div className="settings-field">
            <span className="settings-field__label">Owner</span>
            <span className="settings-field__value">{profile?.ownerName ?? user?.name ?? "—"}</span>
          </div>
          <div className="settings-field">
            <span className="settings-field__label">Account email</span>
            <span className="settings-field__value">{user?.email ?? "—"}</span>
          </div>
          <div className="settings-field">
            <span className="settings-field__label">Heard about us via</span>
            <span className="settings-field__value">{referralSourceLabel ?? "—"}</span>
          </div>
        </div>
      </Card>

      <Card
        title="Plan"
        subtitle={plan === "premium" ? "Premium -- unlimited active agents" : `Free -- up to ${FREE_PLAN_AGENT_LIMIT} active agents`}
        headerAction={<Badge tone={plan === "premium" ? "accent" : "neutral"}>{plan === "premium" ? "Premium" : "Free"}</Badge>}
        className="section-spacing-top"
      >
        <Button
          variant={plan === "premium" ? "secondary" : "primary"}
          icon={<Icon name={plan === "premium" ? "undo" : "sparkles"} size={14} />}
          onClick={() => setPlan(plan === "premium" ? "free" : "premium")}
        >
          {plan === "premium" ? "Downgrade to Free" : "Upgrade to Premium"}
        </Button>
      </Card>

      <div className="section-spacing-top">
        <OnboardingChecklist />
      </div>

      <Card
        title="Integrations"
        subtitle="Connect Gmail, Shopify, and other apps to your workspace."
        className="section-spacing-top"
      >
        <Button variant="secondary" icon={<Icon name="plug" size={14} />} onClick={() => setIntegrationsOpen(true)}>
          Manage integrations
        </Button>
      </Card>

      <Card title="Agents" subtitle="Activate and chat with your specialized AI agents." className="section-spacing-top">
        <Button variant="secondary" icon={<Icon name="bot" size={14} />} onClick={() => setAgentsOpen(true)}>
          Manage agents
        </Button>
      </Card>

      <Modal open={integrationsOpen} onClose={() => setIntegrationsOpen(false)} title="Integrations" size="lg">
        <IntegrationsSection />
      </Modal>

      <Modal open={agentsOpen} onClose={() => setAgentsOpen(false)} title="Agents" size="lg">
        <AgentsSection />
      </Modal>

      <Card title="Dashboard layout" subtitle="Reset your Home dashboard back to its default cards, order, and sizes." className="section-spacing-top">
        <Button variant="secondary" icon={<Icon name="undo" size={14} />} onClick={restoreDefaults}>
          Restore default layout
        </Button>
      </Card>

      <Card
        title="Demo data"
        subtitle="Fill every dashboard card with realistic sample data -- safe to run more than once, it replaces rather than piles up."
        className="section-spacing-top"
      >
        <div className="settings-toggle-row">
          <Button variant="secondary" icon={<Icon name="sparkles" size={14} />} onClick={handleGenerateDemoData}>
            Generate demo data
          </Button>
          {demoDataGenerated && (
            <span className="settings-field__label">
              <Icon name="check" size={13} /> Generated -- check your dashboard
            </span>
          )}
        </div>
      </Card>

      <Card
        title="Preview app states"
        subtitle="Toggle these to see how the dashboard behaves in edge cases -- safe to leave off."
        className="section-spacing-top"
      >
        <div className="settings-toggle-list">
          <ToggleRow
            label="Data sync failure"
            description="Simulate a failed sync so cards show their error state with a retry option."
            checked={syncError}
            onChange={setSyncError}
          />
          <ToggleRow
            label="Agents unavailable"
            description="Simulate the agents being temporarily offline."
            checked={agentUnavailable}
            onChange={setAgentUnavailable}
          />
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="settings-toggle-row">
      <div>
        <p className="settings-toggle-row__label">{label}</p>
        <p className="settings-toggle-row__desc">{description}</p>
      </div>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
    </label>
  );
}
