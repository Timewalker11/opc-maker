import type { AgentActionName, AgentChatMessage, AgentRouting, AgentSource, SpecializedAgentId } from "../types";
import { isOverdue, isDueToday } from "../mock/tasks";
import { integrations } from "../mock/integrations";
import { findAgent } from "../mock/agents";
import { useTasksStore } from "../store/tasksStore";
import { useSocialStore } from "../store/socialStore";
import { useCalendarStore } from "../store/calendarStore";
import { useAlertsStore } from "../store/alertsStore";
import { useRevenueStore } from "../store/revenueStore";
import { useCustomersStore } from "../store/customersStore";
import { useInvoicesStore } from "../store/invoicesStore";
import { useCampaignsStore } from "../store/campaignsStore";
import { useFilesStore } from "../store/filesStore";
import { fetchEmails, type InboxResult } from "./emails";
import { apiFetch, ApiError } from "./apiClient";

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `agent_msg_${messageCounter}`;
}

function reply(content: string, extra: Partial<AgentChatMessage> = {}): AgentChatMessage {
  return {
    id: nextId(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

const HISTORY_LIMIT = 12;
const EMPTY_INBOX: InboxResult = { emails: [], connected: false };

async function safeFetchEmails(): Promise<InboxResult> {
  return fetchEmails().catch(() => EMPTY_INBOX);
}

function agentContext(agentId: SpecializedAgentId, inbox: InboxResult): unknown {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const tasks = useTasksStore.getState().items;
  const customers = useCustomersStore.getState().items;
  const campaigns = useCampaignsStore.getState().items;
  const files = useFilesStore.getState().items;

  const domainData = ((): object => {
    switch (agentId) {
      case "customer":
        return {
          total: customers.length,
          highestValue: [...customers]
            .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
            .slice(0, 5)
            .map((c) => ({ name: c.name, lifetimeValue: c.lifetimeValue })),
          inactive30d: customers
            .filter((c) => !c.lastPurchaseAt || new Date(c.lastPurchaseAt).getTime() < cutoff)
            .map((c) => c.name),
        };

      case "email":
        return {
          connected: inbox.connected,
          total: inbox.emails.length,
          unread: inbox.emails.filter((e) => e.unread).map((e) => ({ from: e.senderName, subject: e.subject, preview: e.preview })),
          urgent: inbox.emails.filter((e) => e.urgent).map((e) => ({ from: e.senderName, subject: e.subject })),
        };

      case "marketing":
        return {
          total: campaigns.length,
          campaigns: campaigns.map((c) => ({
            name: c.name,
            channel: c.channel,
            status: c.status,
            spend: c.spend,
            purchasesGenerated: c.purchasesGenerated,
            performance: c.performance,
          })),
        };

      case "social":
        return {
          scheduled: useSocialStore
            .getState()
            .items.map((p) => ({ platform: p.platform, caption: p.caption, scheduledAt: p.scheduledAt, status: p.status })),
          mediaLibraryImages: files.filter((f) => f.kind === "image").map((f) => f.name),
        };

      case "sales":
        return {
          topOpportunities: [...customers]
            .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
            .slice(0, 5)
            .map((c) => ({ name: c.name, lifetimeValue: c.lifetimeValue, lastPurchaseAt: c.lastPurchaseAt })),
        };

      case "task":
        return {
          total: tasks.length,
          // Full open list (not just due-today/overdue) so the agent can still target a task by
          // id for complete_task even when it isn't due yet (e.g. one it just created itself).
          openTasks: tasks.filter((t) => !t.done).map((t) => ({ id: t.id, title: t.title, dueAt: t.dueAt })),
          dueToday: tasks.filter((t) => !t.done && isDueToday(t)).map((t) => ({ id: t.id, title: t.title })),
          overdue: tasks.filter(isOverdue).map((t) => ({ id: t.id, title: t.title })),
          openCount: tasks.filter((t) => !t.done).length,
        };

      case "scheduling":
        return {
          upcomingEvents: useCalendarStore
            .getState()
            .items.map((e) => ({ title: e.title, startAt: e.startAt, durationMinutes: e.durationMinutes })),
          unfinishedTasks: tasks.filter((t) => !t.done).map((t) => t.title),
        };

      case "storage": {
        const { storageUsedBytes, storageTotalBytes } = useFilesStore.getState();
        return { fileCount: files.length, storageUsedBytes, storageTotalBytes, recentFiles: files.slice(0, 10).map((f) => f.name) };
      }

      case "media":
        return { items: files.filter((f) => f.kind === "image" || f.kind === "media").map((f) => f.name) };

      case "analytics": {
        const { currentMonth, previousMonth } = useRevenueStore.getState();
        const hasRevenue = currentMonth > 0 || previousMonth > 0;
        return {
          revenue: hasRevenue ? { thisMonth: currentMonth, prevMonth: previousMonth } : null,
          campaigns: campaigns.map((c) => ({ name: c.name, performance: c.performance })),
        };
      }

      case "finance": {
        const invoices = useInvoicesStore.getState().items;
        return {
          invoices: invoices.map((i) => ({ customer: i.customerName, amount: i.amount, status: i.status, dueAt: i.dueAt })),
        };
      }

      case "integration":
        return { integrations: integrations.map((i) => ({ name: i.name, status: i.status, lastSyncedAt: i.lastSyncedAt })) };

      case "product":
      case "automation":
        return {};

      default:
        return {};
    }
  })();

  // Every agent can resolve alerts (they aren't tied to one domain), so every agent's context
  // includes the current open ones alongside its own domain data.
  const openAlerts = useAlertsStore
    .getState()
    .items.filter((a) => !a.resolved)
    .map((a) => ({ id: a.id, title: a.title, severity: a.severity }));

  return { ...domainData, openAlerts };
}

interface ChatApiResponse {
  reply: string;
  reasoning?: string;
  sources?: AgentSource[];
  routing?: {
    agentId: SpecializedAgentId;
    action?: AgentActionName;
    args?: Record<string, unknown>;
    proposedAction: string;
    requiresApproval: boolean;
  }[];
  undoable?: boolean;
}

async function callAgentChat(
  agentId: SpecializedAgentId,
  persona: { name: string; description: string; dataAccess: string[] },
  context: unknown,
  rawInput: string,
  history: AgentChatMessage[],
): Promise<AgentChatMessage> {
  try {
    const result = await apiFetch<ChatApiResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        agentId,
        message: rawInput,
        persona,
        context,
        history: history.slice(-HISTORY_LIMIT).map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    // Status isn't resolved here -- requiresApproval:false entries with a real action still need
    // to actually run (see agentStore.sendMessage), so it's left "pending" for the store to settle.
    const routing: AgentRouting[] | undefined = result.routing?.map((r) => ({
      agentId: r.agentId,
      dataAccess: findAgent(r.agentId)?.dataAccess ?? [],
      action: r.action,
      args: r.args,
      proposedAction: r.proposedAction,
      requiresApproval: r.requiresApproval,
      status: "pending",
    }));

    return reply(result.reply, {
      reasoning: result.reasoning,
      sources: result.sources,
      routing,
      undoable: result.undoable,
    });
  } catch (err) {
    return reply(
      err instanceof ApiError
        ? `Sorry, I couldn't reach the AI assistant (${err.message})`
        : "Sorry, something went wrong reaching the AI assistant. Try again in a moment.",
    );
  }
}

// Scoped, single-domain reply generator -- used when the owner opens a chat with one specific
// specialized agent. Each agent only answers within its own realm; it doesn't route to or
// mention the others.
export async function generateSpecializedAgentReply(
  agentId: SpecializedAgentId,
  rawInput: string,
  history: AgentChatMessage[] = [],
): Promise<AgentChatMessage> {
  const agent = findAgent(agentId);
  const inbox = agentId === "email" ? await safeFetchEmails() : EMPTY_INBOX;
  const persona = agent
    ? { name: agent.name, description: agent.description, dataAccess: agent.dataAccess }
    : { name: "Agent", description: "Helps with your business", dataAccess: [] };
  return callAgentChat(agentId, persona, agentContext(agentId, inbox), rawInput, history);
}
