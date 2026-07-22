import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentChatMessage, AgentRouting, CalendarEvent, SocialPlatform, SpecializedAgentId } from "../types";
import { generateSpecializedAgentReply } from "../services/agent";
import { sendEmailReply, publishPost, reconnectIntegration } from "../services/actions";
import { useDemoStateStore } from "./demoStateStore";
import { useTasksStore } from "./tasksStore";
import { useSocialStore } from "./socialStore";
import { useCalendarStore } from "./calendarStore";
import { useAlertsStore } from "./alertsStore";
import { specializedAgents, findAgent } from "../mock/agents";

const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "linkedin", "tiktok"];
const CALENDAR_LOCATIONS: CalendarEvent["location"][] = ["video-call", "phone", "in-person"];

export type ChatId = SpecializedAgentId;

export interface AgentActivityLogEntry {
  id: string;
  description: string;
  timestamp: string;
  undoable: boolean;
  undone: boolean;
}

// A closed-out conversation, archived once the owner starts a new chat with that agent.
export interface AgentChatSession {
  id: string;
  endedAt: string;
  messages: AgentChatMessage[];
}

type AgentStatus = "online" | "thinking" | "unavailable";

let entryCounter = 0;
function nextEntryId() {
  entryCounter += 1;
  return `agent_activity_${entryCounter}`;
}

let sessionCounter = 0;
function nextSessionId() {
  sessionCounter += 1;
  return `agent_session_${sessionCounter}`;
}

function greetingFor(chatId: ChatId): AgentChatMessage {
  const agent = findAgent(chatId);
  const content = agent
    ? `Hi, I'm your ${agent.name}. ${agent.description}. Ask me anything within ${agent.dataAccess.join(", ").toLowerCase()}.`
    : "Hi, how can I help?";
  return { id: `agent_msg_seed_${chatId}`, role: "assistant", content, timestamp: new Date().toISOString() };
}

function initialMessagesByChat(): Record<string, AgentChatMessage[]> {
  const map: Record<string, AgentChatMessage[]> = {};
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
  historyByChat: Record<string, AgentChatSession[]>;
  activityLog: AgentActivityLogEntry[];
  sendMessage: (chatId: ChatId, text: string) => Promise<void>;
  respondToApproval: (chatId: ChatId, messageId: string, routingIndex: number, approve: boolean) => Promise<void>;
  undoActivity: (entryId: string) => void;
  logActivity: (description: string, undoable: boolean) => void;
  // Archives the current conversation (if it has any real back-and-forth) into that agent's
  // History and starts a fresh one.
  startNewChat: (chatId: ChatId) => void;
  // Pulls a past conversation back out of History and makes it live again, archiving whatever
  // was live in its place so nothing gets dropped either way.
  restoreSession: (chatId: ChatId, sessionId: string) => void;
}

// The model's output is only constrained to be valid JSON -- string *contents* (like a
// timestamp) can still come back malformed. Parse and re-serialize so a garbled value never
// reaches the store, instead of just checking `typeof value === "string"`.
function parseIsoTimestamp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString();
}

async function executeRouting(routing: AgentRouting): Promise<{ success: boolean }> {
  const args = routing.args ?? {};
  switch (routing.action) {
    case "create_task": {
      const title = args.title;
      if (typeof title !== "string" || !title.trim()) return { success: false };
      const dueInHours = typeof args.dueInHours === "number" ? args.dueInHours : undefined;
      useTasksStore.getState().addTask(title, dueInHours);
      return { success: true };
    }
    case "complete_task": {
      const taskId = args.taskId;
      if (typeof taskId !== "string" || !useTasksStore.getState().items.some((t) => t.id === taskId)) {
        return { success: false };
      }
      await useTasksStore.getState().toggleDone(taskId);
      return { success: true };
    }
    case "schedule_social_post": {
      const { platform, caption } = args;
      const scheduledAt = parseIsoTimestamp(args.scheduledAt);
      if (typeof platform !== "string" || !SOCIAL_PLATFORMS.includes(platform as SocialPlatform) || typeof caption !== "string" || !scheduledAt) {
        return { success: false };
      }
      useSocialStore.getState().addPost({ platform: platform as SocialPlatform, caption, scheduledAt });
      return { success: true };
    }
    case "create_calendar_event": {
      const { title, durationMinutes, location } = args;
      const startAt = parseIsoTimestamp(args.startAt);
      if (
        typeof title !== "string" ||
        !startAt ||
        typeof durationMinutes !== "number" ||
        typeof location !== "string" ||
        !CALENDAR_LOCATIONS.includes(location as CalendarEvent["location"])
      ) {
        return { success: false };
      }
      useCalendarStore.getState().addEvent({ title, startAt, durationMinutes, location: location as CalendarEvent["location"] });
      return { success: true };
    }
    case "resolve_alert": {
      const alertId = args.alertId;
      if (typeof alertId !== "string" || !useAlertsStore.getState().items.some((a) => a.id === alertId)) {
        return { success: false };
      }
      useAlertsStore.getState().resolve(alertId);
      return { success: true };
    }
    default:
      break;
  }

  // No typed action -- legacy free-text proposal. Still gated behind approval, still stubs.
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

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      activeChatId: specializedAgents[0].id,
      setActiveChatId: (id) => set({ activeChatId: id }),
      statusByChat: {},
      messagesByChat: initialMessagesByChat(),
      historyByChat: {},
      activityLog: [],
      sendMessage: async (chatId, text) => {
        const priorMessages = get().messagesByChat[chatId] ?? [];
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
        const response = await generateSpecializedAgentReply(chatId, text, priorMessages);

        if (response.routing?.length) {
          response.routing = await Promise.all(
            response.routing.map(async (r): Promise<AgentRouting> => {
              if (r.requiresApproval) return { ...r, status: "needs-approval" };
              if (r.action) {
                const result = await executeRouting(r);
                get().logActivity(`${result.success ? "Completed" : "Failed"}: ${r.proposedAction}`, result.success);
                return { ...r, status: result.success ? "success" : "failed" };
              }
              return { ...r, status: "success" };
            }),
          );
        }

        set((s) => ({
          messagesByChat: { ...s.messagesByChat, [chatId]: [...(s.messagesByChat[chatId] ?? []), response] },
          statusByChat: { ...s.statusByChat, [chatId]: "online" },
        }));
      },
      respondToApproval: async (chatId, messageId, routingIndex, approve) => {
        const messages = get().messagesByChat[chatId] ?? [];
        const message = messages.find((m) => m.id === messageId);
        const routingEntry = message?.routing?.[routingIndex];
        if (!routingEntry) return;

        function updateRoutingStatus(status: AgentRouting["status"]) {
          set((s) => ({
            messagesByChat: {
              ...s.messagesByChat,
              [chatId]: (s.messagesByChat[chatId] ?? []).map((m) =>
                m.id === messageId
                  ? { ...m, routing: m.routing?.map((r, i) => (i === routingIndex ? { ...r, status } : r)) }
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
      startNewChat: (chatId) => {
        const current = get().messagesByChat[chatId] ?? [];
        const hasRealContent = current.some((m) => m.role === "user");
        set((s) => ({
          historyByChat: hasRealContent
            ? {
                ...s.historyByChat,
                [chatId]: [
                  { id: nextSessionId(), endedAt: new Date().toISOString(), messages: current },
                  ...(s.historyByChat[chatId] ?? []),
                ],
              }
            : s.historyByChat,
          messagesByChat: { ...s.messagesByChat, [chatId]: [greetingFor(chatId)] },
        }));
      },
      restoreSession: (chatId, sessionId) => {
        const sessions = get().historyByChat[chatId] ?? [];
        const target = sessions.find((session) => session.id === sessionId);
        if (!target) return;
        const current = get().messagesByChat[chatId] ?? [];
        const hasRealContent = current.some((m) => m.role === "user");
        set((s) => ({
          historyByChat: {
            ...s.historyByChat,
            [chatId]: [
              ...(hasRealContent ? [{ id: nextSessionId(), endedAt: new Date().toISOString(), messages: current }] : []),
              ...sessions.filter((session) => session.id !== sessionId),
            ],
          },
          messagesByChat: { ...s.messagesByChat, [chatId]: target.messages },
        }));
      },
    }),
    {
      name: "opc_agent_activity",
      // statusByChat is transient (online/thinking/unavailable) -- persisting it could leave a
      // chat stuck showing "Thinking..." after a reload with no request actually in flight.
      partialize: (state) => ({
        activeChatId: state.activeChatId,
        messagesByChat: state.messagesByChat,
        historyByChat: state.historyByChat,
        activityLog: state.activityLog,
      }),
    },
  ),
);
