import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { specializedAgents } from "../../mock/agents";
import { MAX_STARTING_AGENTS as FREE_PLAN_AGENT_LIMIT } from "../../mock/onboardingWizard";
import type { SpecializedAgentId } from "../../types";
import { useAgentStore } from "../../store/agentStore";
import { useUIStore } from "../../store/uiStore";
import { useAgentSelectionStore, AGENT_LOCK_DAYS } from "../../store/agentSelectionStore";
import { usePlanStore } from "../../store/planStore";
import { formatRelativeTime } from "../../utils/format";

export function AgentsSection() {
  const setActiveChatId = useAgentStore((s) => s.setActiveChatId);
  const setAgentPanelOpen = useUIStore((s) => s.setAgentPanelOpen);
  const activeAgentIds = useAgentSelectionStore((s) => s.activeAgentIds);
  const activate = useAgentSelectionStore((s) => s.activate);
  const deactivate = useAgentSelectionStore((s) => s.deactivate);
  const getLockedUntil = useAgentSelectionStore((s) => s.getLockedUntil);
  const plan = usePlanStore((s) => s.plan);

  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const activeAgents = activeAgentIds
    .map((id) => specializedAgents.find((a) => a.id === id))
    .filter((a): a is (typeof specializedAgents)[number] => Boolean(a));
  const availableAgents = specializedAgents.filter((a) => !activeAgentIds.includes(a.id));

  function handleActivate(id: SpecializedAgentId) {
    if (plan === "free" && activeAgentIds.length >= FREE_PLAN_AGENT_LIMIT) {
      setLimitMessage(
        `The free plan is limited to ${FREE_PLAN_AGENT_LIMIT} active agents. Deactivate one first, or upgrade to Premium for unlimited agents.`,
      );
      return;
    }
    setLimitMessage(null);
    activate(id);
  }

  return (
    <div className="ui-modal__scroll-body thin-scroll">
      <Card
        title="Your AI team"
        subtitle={
          plan === "premium"
            ? "Chosen during setup -- activate more any time"
            : `Free plan -- up to ${FREE_PLAN_AGENT_LIMIT} active agents`
        }
        headerAction={<Badge tone={plan === "premium" ? "accent" : "neutral"}>{plan === "premium" ? "Premium" : "Free plan"}</Badge>}
      >
        {activeAgents.length === 0 ? (
          <p className="record-row__subtitle">No agents activated yet. Turn one on below to get started.</p>
        ) : (
          <ul className="record-list">
            {activeAgents.map((agent) => {
              const lockedUntil = getLockedUntil(agent.id);
              const isLocked = Boolean(lockedUntil && lockedUntil.getTime() > Date.now());
              return (
                <li key={agent.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{agent.name}</p>
                    <p className="record-row__subtitle">{agent.description}</p>
                    <div className="tag-row">
                      {agent.dataAccess.map((d) => (
                        <Badge key={d} tone="neutral">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="record-row__end">
                    <Badge tone="good">Active</Badge>
                    {isLocked && lockedUntil ? (
                      <span className="agent-lock-note" title={`New agents stay active for ${AGENT_LOCK_DAYS} days before they can be turned off.`}>
                        <Icon name="clock" size={13} />
                        Locked -- unlocks {formatRelativeTime(lockedUntil.toISOString())}
                      </span>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => { deactivate(agent.id); setLimitMessage(null); }}>
                        Deactivate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Icon name={agent.icon} size={13} />}
                      onClick={() => {
                        setActiveChatId(agent.id);
                        setAgentPanelOpen(true);
                      }}
                    >
                      Chat
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card title="Available agents" className="section-spacing-top">
        {limitMessage && (
          <div className="inline-banner inline-banner--warning">
            <Icon name="shield" size={15} />
            <span>
              {limitMessage} <Link to="/settings">Upgrade to Premium</Link>
            </span>
            <button onClick={() => setLimitMessage(null)} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
        <ul className="record-list">
          {availableAgents.map((agent) => (
            <li key={agent.id} className="record-row">
              <div className="record-row__main">
                <p className="record-row__title">{agent.name}</p>
                <p className="record-row__subtitle">{agent.description}</p>
                <div className="tag-row">
                  {agent.dataAccess.map((d) => (
                    <Badge key={d} tone="neutral">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="record-row__end">
                <Badge tone="neutral">Available</Badge>
                <Button size="sm" variant="secondary" onClick={() => handleActivate(agent.id)}>
                  Activate
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
