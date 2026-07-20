import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { useAgentStore } from "../../store/agentStore";
import { useUIStore } from "../../store/uiStore";
import { useDemoStateStore } from "../../store/demoStateStore";
import { suggestedCommands } from "../../mock/commands";
import { AgentMessageBubble } from "./AgentMessageBubble";
import { formatRelativeTime } from "../../utils/format";
import "./agent-panel.css";

type Tab = "chat" | "activity";

export function AgentPanel() {
  const open = useUIStore((s) => s.agentPanelOpen);
  const setAgentPanelOpen = useUIStore((s) => s.setAgentPanelOpen);
  const status = useAgentStore((s) => s.status);
  const messages = useAgentStore((s) => s.messages);
  const activityLog = useAgentStore((s) => s.activityLog);
  const sendMessage = useAgentStore((s) => s.sendMessage);
  const respondToApproval = useAgentStore((s) => s.respondToApproval);
  const undoActivity = useAgentStore((s) => s.undoActivity);
  const setAgentUnavailable = useDemoStateStore((s) => s.setAgentUnavailable);

  const [tab, setTab] = useState<Tab>("chat");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!open) {
    return (
      <div className="agent-panel-rail">
        <button
          className="agent-panel-rail__btn"
          onClick={() => setAgentPanelOpen(true)}
          aria-label="Open dashboard agent panel"
        >
          <Icon name="bot" size={19} />
        </button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    sendMessage(trimmed);
  }

  const pendingApprovals = messages.flatMap((m) => (m.routing ?? []).filter((r) => r.status === "needs-approval"));

  return (
    <aside className="agent-panel" aria-label="Dashboard agent assistant">
      <div className="agent-panel__header">
        <div className="agent-panel__title">
          <Icon name="bot" size={18} />
          <span>Dashboard agent</span>
          <AgentStatusBadge status={status} />
        </div>
        <button className="agent-panel__collapse" onClick={() => setAgentPanelOpen(false)} aria-label="Collapse agent panel">
          <Icon name="chevron-right" size={16} />
        </button>
      </div>

      <div className="agent-panel__tabs" role="tablist" aria-label="Agent panel sections">
        <button role="tab" aria-selected={tab === "chat"} className={tab === "chat" ? "is-active" : ""} onClick={() => setTab("chat")}>
          Chat
        </button>
        <button
          role="tab"
          aria-selected={tab === "activity"}
          className={tab === "activity" ? "is-active" : ""}
          onClick={() => setTab("activity")}
        >
          Activity log
          {pendingApprovals.length > 0 && <span className="agent-panel__tab-dot" aria-hidden="true" />}
        </button>
      </div>

      {tab === "chat" && (
        <>
          <div className="agent-panel__scroll thin-scroll" ref={scrollRef}>
            {messages.map((m) => (
              <AgentMessageBubble key={m.id} message={m} onRespondToApproval={respondToApproval} />
            ))}

            {status === "thinking" && (
              <div className="agent-message agent-message--assistant agent-message--thinking">
                <Icon name="loader" size={14} />
                Thinking…
              </div>
            )}

            {status === "unavailable" && (
              <EmptyState
                icon="alert-triangle"
                title="Dashboard agent is unavailable"
                description="It's temporarily offline and can't respond right now."
                compact
                action={
                  <Button size="sm" variant="secondary" onClick={() => setAgentUnavailable(false)}>
                    Retry connection
                  </Button>
                }
              />
            )}

            {messages.length <= 1 && status !== "unavailable" && (
              <div className="agent-panel__suggestions">
                <p className="agent-panel__suggestions-heading">Suggested questions</p>
                {suggestedCommands.slice(0, 4).map((c) => (
                  <button key={c.id} className="agent-panel__suggestion" onClick={() => sendMessage(c.label)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="agent-panel__input-row" onSubmit={handleSubmit}>
            <input
              className="agent-panel__input"
              placeholder="Ask the dashboard agent…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status === "unavailable"}
              aria-label="Message the dashboard agent"
            />
            <button className="agent-panel__send" type="submit" disabled={status === "unavailable" || !input.trim()} aria-label="Send message">
              <Icon name="send" size={15} />
            </button>
          </form>
        </>
      )}

      {tab === "activity" && (
        <div className="agent-panel__scroll thin-scroll">
          {activityLog.length === 0 && (
            <EmptyState icon="clipboard-check" title="No agent activity yet" description="Actions the agent takes will show up here." compact />
          )}
          {activityLog.map((entry) => (
            <div key={entry.id} className="agent-activity-item">
              <p className={entry.undone ? "agent-activity-item__desc agent-activity-item__desc--undone" : "agent-activity-item__desc"}>
                {entry.description}
              </p>
              <div className="agent-activity-item__meta">
                <span>{formatRelativeTime(entry.timestamp)}</span>
                {entry.undoable && !entry.undone && (
                  <button className="agent-activity-item__undo" onClick={() => undoActivity(entry.id)}>
                    <Icon name="undo" size={12} /> Undo
                  </button>
                )}
                {entry.undone && <Badge tone="neutral">Undone</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

function AgentStatusBadge({ status }: { status: "online" | "thinking" | "unavailable" }) {
  if (status === "unavailable") return <Badge tone="critical">Unavailable</Badge>;
  if (status === "thinking") return <Badge tone="accent">Thinking</Badge>;
  return <Badge tone="good">Online</Badge>;
}
