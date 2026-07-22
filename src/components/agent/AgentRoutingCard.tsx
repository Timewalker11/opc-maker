import type { AgentRouting } from "../../types";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { findAgent } from "../../mock/agents";

interface AgentRoutingCardProps {
  routing: AgentRouting;
  onRespond: (approve: boolean) => void;
}

export function AgentRoutingCard({ routing, onRespond }: AgentRoutingCardProps) {
  const agent = findAgent(routing.agentId);

  return (
    <div className="agent-routing-card">
      <div className="agent-routing-card__head">
        <Icon name="bot" size={14} />
        <span>{agent?.name ?? routing.agentId}</span>
        <StatusPill status={routing.status} />
      </div>
      <p className="agent-routing-card__action">{routing.proposedAction}</p>
      <p className="agent-routing-card__access">Access: {routing.dataAccess.join(", ")}</p>
      {routing.status === "needs-approval" && (
        <div className="agent-routing-card__buttons">
          <Button size="sm" variant="primary" onClick={() => onRespond(true)}>
            Approve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRespond(false)}>
            Deny
          </Button>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: AgentRouting["status"] }) {
  switch (status) {
    case "needs-approval":
      return <Badge tone="warning">Needs approval</Badge>;
    case "running":
      return <Badge tone="accent">Running…</Badge>;
    case "success":
      return <Badge tone="good">Succeeded</Badge>;
    case "failed":
      return <Badge tone="critical">Failed</Badge>;
    default:
      return <Badge tone="neutral">Pending</Badge>;
  }
}
