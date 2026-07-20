import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { specializedAgents } from "../mock/agents";
import { useAgentStore } from "../store/agentStore";
import { useDemoStateStore } from "../store/demoStateStore";
import { useUIStore } from "../store/uiStore";

export function Agents() {
  const dashboardAgentStatus = useAgentStore((s) => s.status);
  const agentUnavailable = useDemoStateStore((s) => s.agentUnavailable);
  const setAgentPanelOpen = useUIStore((s) => s.setAgentPanelOpen);

  return (
    <div>
      <PageHeader
        title="Agents"
        description="The dashboard agent coordinates a team of specialized agents, each scoped to one part of your business."
        action={
          <Button variant="primary" icon={<Icon name="bot" size={15} />} onClick={() => setAgentPanelOpen(true)}>
            Open dashboard agent
          </Button>
        }
      />

      <Card
        title="Dashboard agent"
        subtitle="Central coordinator"
        icon={<Icon name="bot" size={16} />}
        headerAction={<Badge tone={agentUnavailable ? "critical" : dashboardAgentStatus === "thinking" ? "accent" : "good"}>{agentUnavailable ? "unavailable" : dashboardAgentStatus}</Badge>}
      >
        <p className="record-row__subtitle">
          Summarizes daily activity, identifies what needs attention, and routes requests to the specialized agents below --
          combining their results and asking for your approval before anything sensitive happens.
        </p>
      </Card>

      <Card title="Specialized agents" className="section-spacing-top">
        <ul className="record-list">
          {specializedAgents.map((agent) => (
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
              <Badge tone="good">Available</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
