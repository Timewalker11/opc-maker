import type { SpecializedAgentId } from "../types";

// Example prompts shown when chatting with one specific specialized agent, scoped to that
// agent's own realm -- each phrase is recognized by that agent's reply matcher.
export const specializedAgentSuggestions: Record<SpecializedAgentId, string[]> = {
  customer: ["Show customers who haven't purchased recently", "Who are my highest-value customers?"],
  email: ["Draft replies to my urgent emails", "How many unread emails do I have?"],
  marketing: ["How are my campaigns performing?", "What's my ad spend this month?"],
  social: ["Create a social post from my latest product image", "What's scheduled to post this week?"],
  sales: ["What leads should I follow up with?", "Show my sales pipeline"],
  task: ["What tasks are due today?", "Show my overdue tasks"],
  scheduling: ["What's on my calendar today?", "Schedule my unfinished tasks"],
  storage: ["How much storage am I using?", "What files were uploaded recently?"],
  media: ["What's in my media library?", "Show my product images"],
  analytics: ["Why did revenue change this month?", "Summarize my performance this month"],
  finance: ["Show overdue invoices", "What's my outstanding balance?"],
  product: ["What products do I have low in stock?", "Show my product catalog"],
  integration: ["Are all my integrations connected?", "What synced most recently?"],
  automation: ["What could you automate for me?", "Show my automation history"],
};
