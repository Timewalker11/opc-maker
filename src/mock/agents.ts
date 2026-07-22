import type { SpecializedAgent } from "../types";

export const specializedAgents: SpecializedAgent[] = [
  { id: "customer", name: "Customer agent", description: "Organizes customer records, relationship history, and follow-ups", dataAccess: ["Customers", "Notes", "Tags"], icon: "users" },
  { id: "email", name: "Email agent", description: "Prioritizes emails, drafts replies, and manages your inbox", dataAccess: ["Inbox", "Sent mail"], icon: "mail" },
  { id: "marketing", name: "Marketing agent", description: "Plans campaigns, tracks results, and recommends improvements", dataAccess: ["Campaigns", "Ad spend"], icon: "megaphone" },
  { id: "social", name: "Social media agent", description: "Creates, schedules, and analyzes social content", dataAccess: ["Social calendar", "Media library"], icon: "instagram" },
  { id: "sales", name: "Sales agent", description: "Tracks leads, opportunities, and recommended next actions", dataAccess: ["Customers", "Orders"], icon: "trending-up" },
  { id: "task", name: "Task & project agent", description: "Organizes projects, deadlines, and daily work", dataAccess: ["Task list"], icon: "clipboard-check" },
  { id: "scheduling", name: "Calendar agent", description: "Schedules appointments and manages reminders", dataAccess: ["Calendar"], icon: "calendar" },
  { id: "storage", name: "File & storage agent", description: "Organizes documents, media, and business files", dataAccess: ["Files", "Storage quota"], icon: "folder" },
  { id: "media", name: "Media agent", description: "Organizes product and marketing media", dataAccess: ["Media library"], icon: "image" },
  { id: "analytics", name: "Analytics agent", description: "Explains trends and generates reports", dataAccess: ["Revenue", "Traffic", "Campaigns"], icon: "bar-chart" },
  { id: "finance", name: "Finance agent", description: "Monitors invoices, payments, expenses, and financial summaries", dataAccess: ["Invoices", "Payments"], icon: "dollar-sign" },
  { id: "product", name: "Product agent", description: "Tracks inventory and product data", dataAccess: ["Products", "Inventory"], icon: "package" },
  { id: "integration", name: "Integration agent", description: "Connects and monitors third-party applications", dataAccess: ["Integrations", "Sync logs"], icon: "plug" },
  { id: "automation", name: "Automation agent", description: "Creates workflows between connected applications", dataAccess: ["Automations", "Automation logs"], icon: "zap" },
];

export function findAgent(id: string) {
  return specializedAgents.find((a) => a.id === id);
}
