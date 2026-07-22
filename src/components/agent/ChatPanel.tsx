import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import type { AgentChatMessage } from "../../types";
import type { AgentChatSession, ChatId } from "../../store/agentStore";
import { useAgentStore } from "../../store/agentStore";
import { useDemoStateStore } from "../../store/demoStateStore";
import { specializedAgentSuggestions } from "../../mock/commands";
import { findAgent } from "../../mock/agents";
import { AgentMessageBubble } from "./AgentMessageBubble";
import { formatRelativeTime } from "../../utils/format";

type Tab = "chat" | "activity" | "history";

interface ChatPanelProps {
  chatId: ChatId;
  onClose: () => void;
}

// Stable references so these selectors don't hand React a brand-new empty array on every call
// when there's nothing stored yet -- returning a fresh `[]` each time makes useSyncExternalStore
// think the snapshot changed on every render, which is an infinite render loop.
const EMPTY_MESSAGES: AgentChatMessage[] = [];
const EMPTY_HISTORY: AgentChatSession[] = [];

export function ChatPanel({ chatId, onClose }: ChatPanelProps) {
  const status = useAgentStore((s) => s.statusByChat[chatId] ?? "online");
  const messages = useAgentStore((s) => s.messagesByChat[chatId] ?? EMPTY_MESSAGES);
  const history = useAgentStore((s) => s.historyByChat[chatId] ?? EMPTY_HISTORY);
  const activityLog = useAgentStore((s) => s.activityLog);
  const sendMessage = useAgentStore((s) => s.sendMessage);
  const respondToApproval = useAgentStore((s) => s.respondToApproval);
  const undoActivity = useAgentStore((s) => s.undoActivity);
  const startNewChat = useAgentStore((s) => s.startNewChat);
  const restoreSession = useAgentStore((s) => s.restoreSession);
  const setAgentUnavailable = useDemoStateStore((s) => s.setAgentUnavailable);

  const [tab, setTab] = useState<Tab>("chat");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const agent = findAgent(chatId);
  const title = agent ? agent.name : "Agent";
  const icon = agent ? agent.icon : "bot";
  const suggestions = agent ? specializedAgentSuggestions[agent.id].map((label, i) => ({ id: `${agent.id}_${i}`, label })) : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Switching agents shouldn't strand the owner on the (shared) activity log expecting to
  // still be looking at that agent's conversation -- land back on Chat each time.
  useEffect(() => {
    setTab("chat");
  }, [chatId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    sendMessage(chatId, trimmed);
  }

  const pendingApprovals = messages.flatMap((m) => (m.routing ?? []).filter((r) => r.status === "needs-approval"));

  return (
    <aside className="agent-panel" aria-label={`${title} assistant`}>
      <div className="agent-panel__header">
        <div className="agent-panel__title">
          <Icon name={icon} size={18} />
          <span>{title}</span>
          <AgentStatusBadge status={status} />
        </div>
        <div className="agent-panel__header-actions">
          <button
            className="agent-panel__collapse"
            onClick={() => {
              startNewChat(chatId);
              setTab("chat");
            }}
            aria-label="Start a new chat"
            title="Start a new chat"
          >
            <Icon name="plus" size={16} />
          </button>
          <button className="agent-panel__collapse" onClick={onClose} aria-label="Collapse agent panel">
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
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
        <button
          role="tab"
          aria-selected={tab === "history"}
          className={tab === "history" ? "is-active" : ""}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      {tab === "chat" && (
        <>
          <div className="agent-panel__scroll thin-scroll" ref={scrollRef}>
            {messages.map((m) => (
              <AgentMessageBubble
                key={m.id}
                message={m}
                onRespondToApproval={(messageId, routingIndex, approve) => respondToApproval(chatId, messageId, routingIndex, approve)}
              />
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
                title={`${title} is unavailable`}
                description="It's temporarily offline and can't respond right now."
                compact
                action={
                  <Button size="sm" variant="secondary" onClick={() => setAgentUnavailable(false)}>
                    Retry connection
                  </Button>
                }
              />
            )}

            {messages.length <= 1 && status !== "unavailable" && suggestions.length > 0 && (
              <div className="agent-panel__suggestions">
                <p className="agent-panel__suggestions-heading">Suggested questions</p>
                {suggestions.map((c) => (
                  <button key={c.id} className="agent-panel__suggestion" onClick={() => sendMessage(chatId, c.label)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="agent-panel__input-row" onSubmit={handleSubmit}>
            <input
              className="agent-panel__input"
              placeholder={`Ask the ${title.toLowerCase()}…`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status === "unavailable"}
              aria-label={`Message the ${title}`}
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
            <EmptyState icon="clipboard-check" title="No agent activity yet" description="Actions your AI team takes will show up here." compact />
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

      {tab === "history" && (
        <div className="agent-panel__scroll thin-scroll">
          {history.length === 0 && (
            <EmptyState icon="clock" title="No past chats yet" description="Start a new chat to archive this conversation here." compact />
          )}
          {history.map((session) => {
            const preview = session.messages.find((m) => m.role === "user")?.content ?? "New chat";
            return (
              <button
                key={session.id}
                className="agent-history-item"
                onClick={() => {
                  restoreSession(chatId, session.id);
                  setTab("chat");
                }}
              >
                <p className="agent-history-item__title truncate">{preview}</p>
                <div className="agent-history-item__meta">
                  <span>{formatRelativeTime(session.endedAt)}</span>
                  <span>{session.messages.length} messages</span>
                </div>
              </button>
            );
          })}
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
