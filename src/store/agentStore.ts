import { create } from "zustand";
import type { AgentChatMessage, AgentRouting, SpecializedAgentId } from "../types";
import { generateAgentReply } from "../services/agent";
import { sendEmailReply, publishPost, reconnectIntegration } from "../services/actions";
import { useDemoStateStore } from "./demoStateStore";

export interface AgentActivityLogEntry {
  id: string;
  description: string;
  timestamp: string;
  undoable: boolean;
  undone: boolean;
}

type AgentStatus = "online" | "thinking" | "unavailable";

interface AgentState {
  status: AgentStatus;
  messages: AgentChatMessage[];
  activityLog: AgentActivityLogEntry[];
  sendMessage: (text: string) => Promise<void>;
  respondToApproval: (messageId: string, agentId: SpecializedAgentId, approve: boolean) => Promise<void>;
  undoActivity: (entryId: string) => void;
  logActivity: (description: string, undoable: boolean) => void;
}

let entryCounter = 0;
function nextEntryId() {
  entryCounter += 1;
  return `agent_activity_${entryCounter}`;
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
  status: "online",
  messages: [
    {
      id: "agent_msg_seed",
      role: "assistant",
      content: "Hi, I'm your dashboard agent. Once you connect your accounts, I can summarize your business, flag what needs attention, and answer questions using your real data. Ask me anything to get started.",
      timestamp: new Date().toISOString(),
    },
  ],
  activityLog: [],
  sendMessage: async (text) => {
    const userMessage: AgentChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMessage] }));

    if (useDemoStateStore.getState().agentUnavailable) {
      set({ status: "unavailable" });
      return;
    }

    set({ status: "thinking" });
    const response = await generateAgentReply(text);
    set((s) => ({ messages: [...s.messages, response], status: "online" }));
  },
  respondToApproval: async (messageId, agentId, approve) => {
    const message = get().messages.find((m) => m.id === messageId);
    const routingEntry = message?.routing?.find((r) => r.agentId === agentId);
    if (!routingEntry) return;

    if (!approve) {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId
            ? { ...m, routing: m.routing?.map((r) => (r.agentId === agentId ? { ...r, status: "failed" as const } : r)) }
            : m,
        ),
      }));
      get().logActivity(`Declined: ${routingEntry.proposedAction}`, false);
      return;
    }

    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === messageId
          ? { ...m, routing: m.routing?.map((r) => (r.agentId === agentId ? { ...r, status: "running" as const } : r)) }
          : m,
      ),
    }));

    const result = await executeRouting(routingEntry);
    const finalStatus = result.success ? "success" : "failed";

    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === messageId
          ? { ...m, routing: m.routing?.map((r) => (r.agentId === agentId ? { ...r, status: finalStatus } : r)) }
          : m,
      ),
    }));
    get().logActivity(
      `${result.success ? "Completed" : "Failed"}: ${routingEntry.proposedAction}`,
      result.success,
    );
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
