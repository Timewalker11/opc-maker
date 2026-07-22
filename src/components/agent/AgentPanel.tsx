import { Icon } from "../ui/Icon";
import { useUIStore } from "../../store/uiStore";
import { useAgentStore } from "../../store/agentStore";
import type { ChatId } from "../../store/agentStore";
import { useAgentSelectionStore } from "../../store/agentSelectionStore";
import { specializedAgents } from "../../mock/agents";
import { ChatPanel } from "./ChatPanel";
import "./agent-panel.css";

export function AgentPanel() {
  const open = useUIStore((s) => s.agentPanelOpen);
  const setAgentPanelOpen = useUIStore((s) => s.setAgentPanelOpen);
  const activeChatId = useAgentStore((s) => s.activeChatId);
  const setActiveChatId = useAgentStore((s) => s.setActiveChatId);
  const activeAgentIds = useAgentSelectionStore((s) => s.activeAgentIds);

  const chatAgents = activeAgentIds
    .map((id) => specializedAgents.find((a) => a.id === id))
    .filter((a): a is (typeof specializedAgents)[number] => Boolean(a));

  function handleSelect(id: ChatId) {
    setActiveChatId(id);
    setAgentPanelOpen(true);
  }

  return (
    <div className="agent-dock">
      {open && <ChatPanel chatId={activeChatId} onClose={() => setAgentPanelOpen(false)} />}

      <div className="agent-rail">
        {chatAgents.map((agent) => (
          <button
            key={agent.id}
            className={`agent-rail__btn ${open && activeChatId === agent.id ? "is-active" : ""}`}
            onClick={() => handleSelect(agent.id)}
            aria-label={agent.name}
            title={agent.name}
          >
            <Icon name={agent.icon} size={18} />
          </button>
        ))}
      </div>
    </div>
  );
}
