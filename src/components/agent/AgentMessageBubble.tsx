import { useState } from "react";
import type { AgentChatMessage, SpecializedAgentId } from "../../types";
import { Icon } from "../ui/Icon";
import { AgentRoutingCard } from "./AgentRoutingCard";
import { formatRelativeTime } from "../../utils/format";

interface AgentMessageBubbleProps {
  message: AgentChatMessage;
  onRespondToApproval: (messageId: string, agentId: SpecializedAgentId, approve: boolean) => void;
}

export function AgentMessageBubble({ message, onRespondToApproval }: AgentMessageBubbleProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = message.role === "user";

  return (
    <div className={`agent-message ${isUser ? "agent-message--user" : "agent-message--assistant"}`}>
      <p className="agent-message__content">{message.content}</p>

      {message.routing && message.routing.length > 0 && (
        <div className="agent-message__routing">
          {message.routing.map((r) => (
            <AgentRoutingCard
              key={r.agentId}
              routing={r}
              onRespond={(agentId, approve) => onRespondToApproval(message.id, agentId, approve)}
            />
          ))}
        </div>
      )}

      {(message.reasoning || (message.sources && message.sources.length > 0)) && (
        <div className="agent-message__meta">
          <button className="agent-message__why-toggle" onClick={() => setShowReasoning((v) => !v)}>
            <Icon name={showReasoning ? "chevron-up" : "chevron-down"} size={12} />
            Why this answer
          </button>
          {showReasoning && (
            <div className="agent-message__why-body">
              {message.reasoning && <p>{message.reasoning}</p>}
              {message.sources && message.sources.length > 0 && (
                <div className="agent-message__sources">
                  {message.sources.map((s) => (
                    <span key={s.label} className="agent-message__source-chip">
                      <Icon name="link" size={11} />
                      {s.label} · {s.section}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <span className="agent-message__time">{formatRelativeTime(message.timestamp)}</span>
    </div>
  );
}
