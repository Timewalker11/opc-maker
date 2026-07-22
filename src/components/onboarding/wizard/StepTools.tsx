import { useMemo, useState } from "react";
import { useOnboardingWizardStore } from "../../../store/onboardingWizardStore";
import { TOOL_OPTIONS } from "../../../mock/onboardingWizard";
import { ToolLogo } from "./ToolLogo";
import { Icon } from "../../ui/Icon";
import { EmptyState } from "../../ui/EmptyState";

export function StepTools() {
  const answers = useOnboardingWizardStore((s) => s.answers);
  const toggleArrayAnswer = useOnboardingWizardStore((s) => s.toggleArrayAnswer);
  const setAnswer = useOnboardingWizardStore((s) => s.setAnswer);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOL_OPTIONS;
    return TOOL_OPTIONS.filter((t) => t.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <p className="wizard-step__eyebrow">Your current stack</p>
      <h2 className="wizard-step__title">Which tools do you already use?</h2>

      <div className="wizard-search">
        <span className="wizard-search__icon">
          <Icon name="search" size={16} />
        </span>
        <input
          type="text"
          placeholder="Search apps…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tools"
        />
      </div>

      <div className="tool-grid">
        {filtered.length === 0 && (
          <div className="tool-grid__empty">
            <EmptyState icon="search" title="No tools match" description="Try a different search, or add it below." compact />
          </div>
        )}
        {filtered.map((tool) => {
          const selected = answers.tools.includes(tool.value);
          return (
            <button
              key={tool.value}
              type="button"
              className={`tool-card ${selected ? "tool-card--selected" : ""}`}
              onClick={() => toggleArrayAnswer("tools", tool.value)}
              aria-pressed={selected}
            >
              <ToolLogo initials={tool.initials} color={tool.color} />
              <span className="tool-card__label">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="wizard-step__field">
        <label htmlFor="otherTools">Other</label>
        <input
          id="otherTools"
          type="text"
          placeholder="Anything else you use day to day"
          value={answers.otherTools}
          onChange={(e) => setAnswer("otherTools", e.target.value)}
        />
      </div>

      <p className="wizard-step__note">
        <Icon name="link" size={15} />
        You can connect these later. This helps us recommend the best workspace.
      </p>
    </div>
  );
}
