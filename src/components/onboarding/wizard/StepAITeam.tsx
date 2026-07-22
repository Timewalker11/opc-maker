import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { WIZARD_AGENT_OPTIONS, MAX_STARTING_AGENTS } from "../../../mock/onboardingWizard";
import { OptionCard } from "./OptionCard";
import { Icon } from "../../ui/Icon";

export function StepAITeam() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const toggleArrayAnswer = useOnboardingWizardStore((s) => s.toggleArrayAnswer);

  const count = answers.selectedAgents.length;
  const atCap = count >= MAX_STARTING_AGENTS;

  return (
    <div>
      <p className="wizard-step__eyebrow">Your AI team</p>
      <h2 className="wizard-step__title">Which parts of your business do you want AI to help manage?</h2>
      <p className="wizard-step__subtitle">
        Choose up to three areas to start. You can add or remove agents at any time.
      </p>

      <div className="wizard-grid wizard-grid--cols-2">
        {WIZARD_AGENT_OPTIONS.map((agent) => {
          const selected = answers.selectedAgents.includes(agent.id);
          return (
            <OptionCard
              key={agent.id}
              icon={agent.icon}
              label={agent.name}
              description={agent.description}
              selected={selected}
              disabled={!selected && atCap}
              onClick={() => toggleArrayAnswer("selectedAgents", agent.id, MAX_STARTING_AGENTS)}
            />
          );
        })}
      </div>

      <div aria-live="polite">
        {atCap ? (
          <p className="agent-cap-banner">
            <Icon name="check" size={15} />
            You've selected your starting AI team. You can activate additional agents later from the Agent Center.
          </p>
        ) : (
          <span className="agent-count-pill">
            {count} of {MAX_STARTING_AGENTS} selected
          </span>
        )}
      </div>
    </div>
  );
}
