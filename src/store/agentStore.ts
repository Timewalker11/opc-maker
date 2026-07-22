import { create } from "zustand";
import type { AgentChatMessage, AgentRouting, SpecializedAgentId } from "../types";
import { generateAgentReply, generateSpecializedAgentReply } from "../services/agent";
import { sendEmailReply, publishPost, reconnectIntegration } from "../services/actions";
import { useDemoStateStore } from "./demoStateStore";
import { specializedAgents, findAgent } from "../mock/agents";

export type ChatId = "dashboard" | SpecializedAgentId;

export interface AgentActivityLogEntry {
  id: string;
  description: string;
  timestamp: string;
  undoable: boolean;
  undone: boolean;
}

type AgentStatus = "online" | "thinking" | "unavailable";

let entryCounter = 0;
function nextEntryId() {
  entryCounter += 1;
  return `agent_activity_${entryCounter}`;
}

function greetingFor(chatId: ChatId): AgentChatMessage {
  if (chatId === "dashboard") {
    return {
      id: "agent_msg_seed_dashboard",
      role: "assistant",
      content:
        "Hi, I'm your dashboard agent. Once you connect your accounts, I can summarize your business, flag what needs attention, and answer questions using your real data. Ask me anything to get started.",
      timestamp: new Date().toISOString(),
    };
  }
  const agent = findAgent(chatId);
  const content = agent
    ? `Hi, I'm your ${agent.name}. ${agent.description}. Ask me anything within ${agent.dataAccess.join(", ").toLowerCase()}.`
    : "Hi, how can I help?";
  return { id: `agent_msg_seed_${chatId}`, role: "assistant", content, timestamp: new Date().toISOString() };
}

function initialMessagesByChat(): Record<string, AgentChatMessage[]> {
  const map: Record<string, AgentChatMessage[]> = { dashboard: [greetingFor("dashboard")] };
  specializedAgents.forEach((a) => {
    map[a.id] = [greetingFor(a.id)];
  });
  return map;
}

interface AgentState {
  activeChatId: ChatId;
  setActiveChatId: (id: ChatId) => void;
  statusByChat: Record<string, AgentStatus>;
  messagesByChat: Record<string, AgentChatMessage[]>;
  activityLog: AgentActivityLogEntry[];
  sendMessage: (chatId: ChatId, text: string) => Promise<void>;
  respondToApproval: (chatId: ChatId, messageId: string, agentId: SpecializedAgentId, approve: boolean) => Promise<void>;
  undoActivity: (entryId: string) => void;
  logActivity: (description: string, undoable: boolean) => void;
}

async function executeRouting(routing: AgentRouting): Promise<{ success: boolean }> {
  switch (routing.agentId) {
    case "email":
      return sendEmailReply(routing.agentId, routing.proposedAction);
    case "social":
      return publishPost(routing.agentId);
    case "integration":
      try {
        return await reconnectIntegration(routing.agentId);
      } catch {
        return { success: false };
      }
    default:
      return { success: true };
  }
}

export const useAgentStore = create<AgentState>()((set, get) => ({
  activeChatId: "dashboard",
  setActiveChatId: (id) => set({ activeChatId: id }),
  statusByChat: {},
  messagesByChat: initialMessagesByChat(),
  activityLog: [],
  sendMessage: async (chatId, text) => {
    const userMessage: AgentChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({
      messagesByChat: { ...s.messagesByChat, [chatId]: [...(s.messagesByChat[chatId] ?? []), userMessage] },
    }));

    if (useDemoStateStore.getState().agentUnavailable) {
      set((s) => ({ statusByChat: { ...s.statusByChat, [chatId]: "unavailable" } }));
      return;
    }

    set((s) => ({ statusByChat: { ...s.statusByChat, [chatId]: "thinking" } }));
    const response = chatId === "dashboard" ? await generateAgentReply(text) : await generateSpecializedAgentReply(chatId, text);
    set((s) => ({
      messagesByChat: { ...s.messagesByChat, [chatId]: [...(s.messagesByChat[chatId] ?? []), response] },
      statusByChat: { ...s.statusByChat, [chatId]: "online" },
    }));
  },
  respondToApproval: async (chatId, messageId, agentId, approve) => {
    const messages = get().messagesByChat[chatId] ?? [];
    const message = messages.find((m) => m.id === messageId);
    const routingEntry = message?.routing?.find((r) => r.agentId === agentId);
    if (!routingEntry) return;

    function updateRoutingStatus(status: AgentRouting["status"]) {
      set((s) => ({
        messagesByChat: {
          ...s.messagesByChat,
          [chatId]: (s.messagesByChat[chatId] ?? []).map((m) =>
            m.id === messageId
              ? { ...m, routing: m.routing?.map((r) => (r.agentId === agentId ? { ...r, status } : r)) }
              : m,
          ),
        },
      }));
    }

    if (!approve) {
      updateRoutingStatus("failed");
      get().logActivity(`Declined: ${routingEntry.proposedAction}`, false);
      return;
    }

    updateRoutingStatus("running");
    const result = await executeRouting(routingEntry);
    updateRoutingStatus(result.success ? "success" : "failed");
    get().logActivity(`${result.success ? "Completed" : "Failed"}: ${routingEntry.proposedAction}`, result.success);
  },
  undoActivity: (entryId) =>
    set((s) => ({ activityLog: s.activityLog.map((e) => (e.id === entryId ? { ...e, undone: true } : e)) })),
  logActivity: (description, undoable) =>
    set((s) => ({
      activityLog: [
        { id: nextEntryId(), description, timestamp: new Date().toISOString(), undoable, undone: false },
        ...s.activityLog,
      ],
    })),
}));
