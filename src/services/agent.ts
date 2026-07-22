import type { AgentChatMessage, AgentRouting, SpecializedAgentId } from "../types";
import { business } from "../mock/business";
import { tasks, isOverdue, isDueToday } from "../mock/tasks";
import { emails } from "../mock/emails";
import { alerts } from "../mock/alerts";
import { customers } from "../mock/customers";
import { invoices } from "../mock/invoices";
import { files, storageUsedBytes, storageTotalBytes } from "../mock/files";
import { campaigns } from "../mock/campaigns";
import { calendarEvents } from "../mock/calendar";
import { socialPosts } from "../mock/social";
import { integrations } from "../mock/integrations";
import { findAgent } from "../mock/agents";
import { formatBytes } from "../utils/format";
import { mockRequest } from "./apiClient";

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

function routing(partial: Omit<AgentRouting, "status"> & { status?: AgentRouting["status"] }): AgentRouting {
  return { status: "needs-approval", ...partial };
}

function matches(input: string, ...phrases: string[]) {
  return phrases.some((p) => input.includes(p));
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

export function generateAgentReply(rawInput: string): Promise<AgentChatMessage> {
  const input = rawInput.trim().toLowerCase();
  const overdueTasks = tasks.filter(isOverdue);
  const dueTodayTasks = tasks.filter((t) => !t.done && isDueToday(t));
  const urgentEmails = emails.filter((e) => e.urgent);
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  if (matches(input, "summarize", "summary")) {
    const hasRevenue = business.revenueThisMonth > 0 || business.revenuePrevMonth > 0;
    const revenueLine = hasRevenue
      ? `Revenue is at $${business.revenueThisMonth.toLocaleString()} this month, ${percentChange(business.revenueThisMonth, business.revenuePrevMonth)}% vs. last month.`
      : "There's no revenue data connected yet.";
    const topAlert = unresolvedAlerts[0];
    const alertLine = topAlert ? ` -- "${topAlert.title}" is the most pressing.` : ".";
    return mockRequest(
      reply(
        `${revenueLine} You have ${dueTodayTasks.length} task(s) due today (${overdueTasks.length} overdue), ${urgentEmails.length} urgent email(s), and ${unresolvedAlerts.length} open alert(s)${alertLine}`,
        {
          reasoning: "Combined revenue, task, email, and alert data to produce a single-paragraph daily summary.",
          sources: [
            { label: "Revenue summary", section: "Analytics" },
            { label: "Tasks due today", section: "Work" },
            { label: "Unread emails", section: "Communications" },
            { label: "Alerts and problems", section: "Home" },
          ],
          routing: [
            routing({ agentId: "analytics", dataAccess: ["Revenue", "Trend"], proposedAction: "Summarize monthly revenue", requiresApproval: false, status: "success" }),
            routing({ agentId: "task", dataAccess: ["Task list"], proposedAction: "Count due/overdue tasks", requiresApproval: false, status: "success" }),
          ],
        },
      ),
    );
  }

  if (matches(input, "attention", "urgent", "what needs")) {
    const items = [
      overdueTasks.length ? `${overdueTasks.length} overdue task(s)` : null,
      urgentEmails.length ? `${urgentEmails.length} urgent email(s)` : null,
      unresolvedAlerts.length ? `${unresolvedAlerts.length} open alert(s)` : null,
    ].filter(Boolean);
    return mockRequest(
      reply(
        items.length
          ? `Here's what needs your attention: ${items.join(", ")}.`
          : "Nothing urgent right now -- you're all caught up.",
        {
          reasoning: "Ranked open items by urgency across tasks, email, and alerts.",
          sources: [
            { label: "Tasks due today", section: "Home" },
            { label: "Unread emails", section: "Home" },
            { label: "Alerts and problems", section: "Home" },
          ],
        },
      ),
    );
  }

  if (matches(input, "draft repl", "reply to urgent", "reply to email")) {
    return mockRequest(
      urgentEmails.length
        ? reply(
            `I can draft replies to your ${urgentEmails.length} urgent email(s) from ${urgentEmails.map((e) => e.senderName).join(", ")}. Sending email requires your approval, so I'll prepare the drafts and hand them to you to review first.`,
            {
              reasoning: "Sending email is a sensitive action, so drafts are prepared but withheld from sending until approved.",
              sources: [{ label: "Unread emails", section: "Communications" }],
              routing: [
                routing({
                  agentId: "email",
                  dataAccess: ["Inbox", "Sent mail"],
                  proposedAction: `Draft replies to ${urgentEmails.map((e) => e.senderName).join(", ")}`,
                  requiresApproval: true,
                  status: "needs-approval",
                }),
              ],
            },
          )
        : reply("You don't have any urgent emails right now.", {
            sources: [{ label: "Unread emails", section: "Communications" }],
          }),
    );
  }

  if (matches(input, "not purchased", "inactive customers", "haven't purchased", "have not purchased")) {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const inactive = customers.filter((c) => !c.lastPurchaseAt || new Date(c.lastPurchaseAt).getTime() < cutoff);
    return mockRequest(
      reply(
        inactive.length
          ? `${inactive.length} customer(s) haven't purchased in the last 30 days: ${inactive.map((c) => c.name).join(", ")}.`
          : "Every customer has purchased within the last 30 days, or you don't have any customers imported yet.",
        {
          reasoning: "Filtered customers by last purchase date.",
          sources: [{ label: "Customers", section: "Customers" }],
          routing: [
            routing({ agentId: "customer", dataAccess: ["Customers", "Orders"], proposedAction: "Filter customers by purchase recency", requiresApproval: false, status: "success" }),
          ],
        },
      ),
    );
  }

  if (matches(input, "social post from", "latest product image", "create a social post")) {
    const latestImage = files.find((f) => f.kind === "image");
    return mockRequest(
      latestImage
        ? reply(
            `I've drafted an Instagram post using "${latestImage.name}". It's saved as a draft in your social calendar -- publishing still needs your approval.`,
            {
              reasoning: "Creating a draft is reversible and low-risk; publishing is withheld pending approval since it's a sensitive action.",
              sources: [{ label: "Files", section: "Files" }],
              routing: [
                routing({ agentId: "media", dataAccess: ["Media library"], proposedAction: "Select latest product image", requiresApproval: false, status: "success" }),
                routing({ agentId: "social", dataAccess: ["Social calendar"], proposedAction: "Create draft post from image", requiresApproval: false, status: "success" }),
              ],
              undoable: true,
            },
          )
        : reply("You don't have any product images uploaded yet -- upload one and I can create a draft post from it.", {
            sources: [{ label: "Files", section: "Files" }],
          }),
    );
  }

  if (matches(input, "revenue decreased", "revenue changed", "why revenue")) {
    const hasRevenue = business.revenueThisMonth > 0 || business.revenuePrevMonth > 0;
    if (!hasRevenue) {
      return mockRequest(
        reply("There's no revenue data connected yet, so I can't explain a change -- connect a payment or ecommerce platform first.", {
          sources: [{ label: "Revenue summary", section: "Analytics" }],
        }),
      );
    }
    const pct = percentChange(business.revenueThisMonth, business.revenuePrevMonth);
    const direction = pct >= 0 ? "up" : "down";
    const underperformer = campaigns.find((c) => c.performance === "underperforming");
    const campaignLine = underperformer ? ` The one soft spot is the "${underperformer.name}" campaign, which is underperforming relative to your other channels.` : "";
    return mockRequest(
      reply(
        `Revenue is ${direction} ${Math.abs(pct)}% this month -- $${business.revenueThisMonth.toLocaleString()} vs. $${business.revenuePrevMonth.toLocaleString()} last month.${campaignLine}`,
        {
          reasoning: "Checked the premise against actual revenue data before answering.",
          sources: [
            { label: "Revenue summary", section: "Analytics" },
            { label: "Campaigns", section: "Marketing" },
          ],
        },
      ),
    );
  }

  if (matches(input, "schedule my unfinished", "schedule tasks", "schedule my tasks")) {
    const unfinished = tasks.filter((t) => !t.done);
    return mockRequest(
      reply(
        unfinished.length
          ? `I've proposed time blocks for your ${unfinished.length} unfinished task(s) this week, starting with the highest-priority ones. Nothing sensitive here, so I can go ahead -- let me know if you'd like to adjust the order.`
          : "You don't have any unfinished tasks to schedule right now.",
        {
          reasoning: "Scheduling internal tasks doesn't affect customers or money, so it doesn't require approval.",
          sources: [
            { label: "Tasks due today", section: "Work" },
            { label: "Upcoming calendar events", section: "Work" },
          ],
          routing: unfinished.length
            ? [
                routing({ agentId: "task", dataAccess: ["Task list"], proposedAction: "Rank unfinished tasks by priority", requiresApproval: false, status: "success" }),
                routing({ agentId: "scheduling", dataAccess: ["Calendar"], proposedAction: "Propose time blocks for each task", requiresApproval: false, status: "success" }),
              ]
            : undefined,
        },
      ),
    );
  }

  if (matches(input, "overdue invoice")) {
    const overdue = invoices.filter((i) => i.status === "overdue");
    return mockRequest(
      reply(
        overdue.length
          ? `${overdue.length} overdue invoice(s): ${overdue.map((i) => `${i.customerName} ($${i.amount})`).join(", ")}.`
          : "No overdue invoices right now.",
        { sources: [{ label: "Invoices", section: "Analytics" }] },
      ),
    );
  }

  return mockRequest(
    reply(
      "I can help with that -- try asking me to summarize your business, flag what needs attention, or draft replies to urgent emails. I'll always ask before sending anything, publishing, or touching payments.",
      { reasoning: "No specific matching capability found for this request, so offering example commands instead." },
    ),
  );
}

function fallback(agentId: SpecializedAgentId, examples: string[]): AgentChatMessage {
  const agent = findAgent(agentId);
  const capability = agent ? agent.description.charAt(0).toLowerCase() + agent.description.slice(1) : "help with that";
  const examplesLine =
    examples.length > 0 ? ` Try asking me to "${examples[0]}"${examples[1] ? ` or "${examples[1]}"` : ""}.` : "";
  return reply(`I ${capability}.${examplesLine}`);
}

// Scoped, single-domain counterpart to generateAgentReply -- used when the owner opens a chat
// with one specific specialized agent instead of the dashboard coordinator. Each agent only
// answers within its own realm; it doesn't route to or mention the others.
export function generateSpecializedAgentReply(agentId: SpecializedAgentId, rawInput: string): Promise<AgentChatMessage> {
  const input = rawInput.trim().toLowerCase();

  switch (agentId) {
    case "customer": {
      if (matches(input, "valuable", "highest value", "best customer")) {
        const ranked = [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 5);
        return mockRequest(
          reply(
            ranked.length
              ? `Your highest-value customers: ${ranked.map((c) => `${c.name} ($${c.lifetimeValue.toLocaleString()})`).join(", ")}.`
              : "You don't have any customers imported yet -- import your list and I can rank them by value.",
            { sources: [{ label: "Customers", section: "Customers" }] },
          ),
        );
      }
      if (matches(input, "not purchased", "inactive", "haven't purchased", "have not purchased", "follow up", "leads")) {
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const inactive = customers.filter((c) => !c.lastPurchaseAt || new Date(c.lastPurchaseAt).getTime() < cutoff);
        return mockRequest(
          reply(
            customers.length === 0
              ? "You don't have any customers imported yet -- import your list and I can track relationships and follow-ups here."
              : inactive.length
                ? `${inactive.length} customer(s) haven't purchased in the last 30 days: ${inactive.map((c) => c.name).join(", ")}.`
                : "Every customer has purchased within the last 30 days.",
            { sources: [{ label: "Customers", section: "Customers" }] },
          ),
        );
      }
      return mockRequest(fallback("customer", ["Show customers who haven't purchased recently", "Who are my highest-value customers?"]));
    }

    case "email": {
      const urgentEmails = emails.filter((e) => e.urgent);
      const unreadEmails = emails.filter((e) => e.unread);
      if (matches(input, "draft repl", "reply to urgent", "reply to email")) {
        return mockRequest(
          urgentEmails.length
            ? reply(
                `I can draft replies to your ${urgentEmails.length} urgent email(s) from ${urgentEmails.map((e) => e.senderName).join(", ")}. Sending requires your approval, so I'll prepare the drafts first.`,
                {
                  sources: [{ label: "Unread emails", section: "Communications" }],
                  routing: [
                    routing({
                      agentId: "email",
                      dataAccess: ["Inbox", "Sent mail"],
                      proposedAction: `Draft replies to ${urgentEmails.map((e) => e.senderName).join(", ")}`,
                      requiresApproval: true,
                      status: "needs-approval",
                    }),
                  ],
                },
              )
            : reply("You don't have any urgent emails right now.", { sources: [{ label: "Unread emails", section: "Communications" }] }),
        );
      }
      if (matches(input, "unread", "how many email")) {
        return mockRequest(
          reply(
            unreadEmails.length ? `You have ${unreadEmails.length} unread email(s).` : "Your inbox is all caught up.",
            { sources: [{ label: "Unread emails", section: "Communications" }] },
          ),
        );
      }
      return mockRequest(fallback("email", ["Draft replies to my urgent emails", "How many unread emails do I have?"]));
    }

    case "marketing": {
      if (matches(input, "campaign", "performing", "performance", "ad spend")) {
        const underperforming = campaigns.filter((c) => c.performance === "underperforming");
        const topPerformers = campaigns.filter((c) => c.performance === "top-performer");
        return mockRequest(
          reply(
            campaigns.length === 0
              ? "You don't have any campaigns connected yet -- connect a marketing platform and I can track performance here."
              : `${topPerformers.length} campaign(s) are top performers, ${underperforming.length} are underperforming out of ${campaigns.length} total.`,
            { sources: [{ label: "Campaigns", section: "Marketing" }] },
          ),
        );
      }
      return mockRequest(fallback("marketing", ["How are my campaigns performing?", "What's my ad spend this month?"]));
    }

    case "social": {
      if (matches(input, "social post from", "latest product image", "create a social post")) {
        const latestImage = files.find((f) => f.kind === "image");
        return mockRequest(
          latestImage
            ? reply(
                `I've drafted a post using "${latestImage.name}". It's saved as a draft -- publishing still needs your approval.`,
                {
                  sources: [{ label: "Files", section: "Files" }],
                  routing: [routing({ agentId: "social", dataAccess: ["Social calendar"], proposedAction: "Create draft post from image", requiresApproval: true })],
                  undoable: true,
                },
              )
            : reply("You don't have any product images uploaded yet -- upload one and I can create a draft post from it.", {
                sources: [{ label: "Files", section: "Files" }],
              }),
        );
      }
      if (matches(input, "scheduled", "this week", "posting")) {
        return mockRequest(
          reply(
            socialPosts.length
              ? `You have ${socialPosts.length} post(s) scheduled.`
              : "Nothing is scheduled yet -- connect a social account and I can plan your posting calendar.",
            { sources: [{ label: "Scheduled social posts", section: "Marketing" }] },
          ),
        );
      }
      return mockRequest(fallback("social", ["Create a social post from my latest product image", "What's scheduled to post this week?"]));
    }

    case "sales": {
      if (matches(input, "lead", "opportunit", "pipeline", "follow up")) {
        const ranked = [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 5);
        return mockRequest(
          reply(
            ranked.length
              ? `Your best follow-up opportunities right now: ${ranked.map((c) => c.name).join(", ")}.`
              : "You don't have any customers or orders connected yet -- once you do, I'll surface your best leads here.",
            { sources: [{ label: "Customers", section: "Customers" }] },
          ),
        );
      }
      return mockRequest(fallback("sales", ["What leads should I follow up with?", "Show my sales pipeline"]));
    }

    case "task": {
      const overdueTasks = tasks.filter(isOverdue);
      const dueTodayTasks = tasks.filter((t) => !t.done && isDueToday(t));
      if (matches(input, "due today", "overdue", "my tasks", "what's on my plate", "on my plate")) {
        return mockRequest(
          reply(
            tasks.length === 0
              ? "You don't have any tasks yet -- create one and I'll help you keep track of it."
              : `${dueTodayTasks.length} task(s) due today, ${overdueTasks.length} overdue.`,
            {
              sources: [{ label: "Tasks", section: "Work" }],
              routing: [routing({ agentId: "task", dataAccess: ["Task list"], proposedAction: "Count due/overdue tasks", requiresApproval: false, status: "success" })],
            },
          ),
        );
      }
      return mockRequest(fallback("task", ["What tasks are due today?", "Show my overdue tasks"]));
    }

    case "scheduling": {
      if (matches(input, "calendar", "meeting", "this week", "today", "upcoming")) {
        return mockRequest(
          reply(
            calendarEvents.length
              ? `You have ${calendarEvents.length} upcoming event(s) on your calendar.`
              : "Your calendar is empty right now -- connect it and I can manage appointments and reminders here.",
            { sources: [{ label: "Calendar", section: "Work" }] },
          ),
        );
      }
      if (matches(input, "schedule my unfinished", "schedule tasks", "schedule my tasks")) {
        const unfinished = tasks.filter((t) => !t.done);
        return mockRequest(
          reply(
            unfinished.length
              ? `I've proposed time blocks for your ${unfinished.length} unfinished task(s) this week. Nothing sensitive here, so I've gone ahead -- let me know if you'd like to adjust the order.`
              : "You don't have any unfinished tasks to schedule right now.",
            {
              sources: [{ label: "Tasks", section: "Work" }, { label: "Calendar", section: "Work" }],
              routing: unfinished.length
                ? [routing({ agentId: "scheduling", dataAccess: ["Calendar"], proposedAction: "Propose time blocks for each task", requiresApproval: false, status: "success" })]
                : undefined,
            },
          ),
        );
      }
      return mockRequest(fallback("scheduling", ["What's on my calendar today?", "Schedule my unfinished tasks"]));
    }

    case "finance": {
      const overdue = invoices.filter((i) => i.status === "overdue");
      if (matches(input, "overdue invoice", "invoice", "outstanding", "payments")) {
        return mockRequest(
          reply(
            invoices.length === 0
              ? "You don't have any invoices connected yet -- connect a payment platform and I can track them here."
              : overdue.length
                ? `${overdue.length} overdue invoice(s): ${overdue.map((i) => `${i.customerName} ($${i.amount})`).join(", ")}.`
                : "No overdue invoices right now.",
            { sources: [{ label: "Invoices", section: "Analytics" }] },
          ),
        );
      }
      return mockRequest(fallback("finance", ["Show overdue invoices", "What's my outstanding balance?"]));
    }

    case "analytics": {
      const hasRevenue = business.revenueThisMonth > 0 || business.revenuePrevMonth > 0;
      if (matches(input, "revenue", "trend", "performance", "report", "summar")) {
        if (!hasRevenue) {
          return mockRequest(
            reply("There's no revenue data connected yet -- connect a payment or ecommerce platform and I'll start reporting on it.", {
              sources: [{ label: "Revenue summary", section: "Analytics" }],
            }),
          );
        }
        const pct = percentChange(business.revenueThisMonth, business.revenuePrevMonth);
        const direction = pct >= 0 ? "up" : "down";
        return mockRequest(
          reply(
            `Revenue is ${direction} ${Math.abs(pct)}% this month -- $${business.revenueThisMonth.toLocaleString()} vs. $${business.revenuePrevMonth.toLocaleString()} last month.`,
            { sources: [{ label: "Revenue summary", section: "Analytics" }] },
          ),
        );
      }
      return mockRequest(fallback("analytics", ["Why did revenue change this month?", "Summarize my performance this month"]));
    }

    case "storage": {
      if (matches(input, "storage", "space", "how much", "files")) {
        return mockRequest(
          reply(
            files.length === 0
              ? `You haven't uploaded any files yet. You're using ${formatBytes(storageUsedBytes)} of ${formatBytes(storageTotalBytes)}.`
              : `You've used ${formatBytes(storageUsedBytes)} of ${formatBytes(storageTotalBytes)} across ${files.length} file(s).`,
            { sources: [{ label: "Files", section: "Files" }] },
          ),
        );
      }
      return mockRequest(fallback("storage", ["How much storage am I using?", "What files were uploaded recently?"]));
    }

    case "media": {
      const media = files.filter((f) => f.kind === "image" || f.kind === "media");
      if (matches(input, "media library", "images", "photos", "product image")) {
        return mockRequest(
          reply(
            media.length ? `Your media library has ${media.length} item(s).` : "Your media library is empty -- upload some images or video and I'll help organize them.",
            { sources: [{ label: "Files", section: "Files" }] },
          ),
        );
      }
      return mockRequest(fallback("media", ["What's in my media library?", "Show my product images"]));
    }

    case "integration": {
      if (matches(input, "integration", "connected", "sync")) {
        const connected = integrations.filter((i) => i.status === "connected");
        return mockRequest(
          reply(
            integrations.length === 0
              ? "You don't have any integrations connected yet -- head to Integrations to connect Shopify or Google."
              : `${connected.length} of ${integrations.length} integration(s) are connected.`,
            { sources: [{ label: "Integrations", section: "Integrations" }] },
          ),
        );
      }
      return mockRequest(fallback("integration", ["Are all my integrations connected?", "What synced most recently?"]));
    }

    case "product":
      return mockRequest(fallback("product", ["What products do I have low in stock?", "Show my product catalog"]));

    case "automation":
      return mockRequest(fallback("automation", ["What could you automate for me?", "Show my automation history"]));

    default:
      return mockRequest(fallback(agentId, []));
  }
}
