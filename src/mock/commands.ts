import type { CommandSuggestion } from "../types";

export const suggestedCommands: CommandSuggestion[] = [
  { id: "cmd_summarize", label: "Summarize my business today" },
  { id: "cmd_attention", label: "What needs my attention?" },
  { id: "cmd_draft_replies", label: "Draft replies to urgent emails" },
  { id: "cmd_inactive_customers", label: "Show customers who have not purchased recently" },
  { id: "cmd_social_from_image", label: "Create a social post from my latest product image" },
  { id: "cmd_revenue_explain", label: "Explain why revenue changed this week" },
  { id: "cmd_schedule_tasks", label: "Schedule my unfinished tasks" },
];

export const recentCommands: CommandSuggestion[] = [
  { id: "recent_1", label: "What needs my attention?" },
  { id: "recent_2", label: "Show overdue invoices" },
];
