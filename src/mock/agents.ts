import type { SpecializedAgent } from "../types";

export const specializedAgents: SpecializedAgent[] = [
  { id: "customer", name: "Customer agent", description: "Manages customer records and relationships", dataAccess: ["Customers", "Notes", "Tags"] },
  { id: "email", name: "Email agent", description: "Reads and drafts email replies", dataAccess: ["Inbox", "Sent mail"] },
  { id: "marketing", name: "Marketing agent", description: "Monitors and adjusts campaigns", dataAccess: ["Campaigns", "Ad spend"] },
  { id: "social", name: "Social media agent", description: "Drafts and schedules social posts", dataAccess: ["Social calendar", "Media library"] },
  { id: "sales", name: "Sales agent", description: "Tracks leads and follow-ups", dataAccess: ["Customers", "Orders"] },
  { id: "task", name: "Task agent", description: "Creates and schedules tasks", dataAccess: ["Task list"] },
  { id: "scheduling", name: "Scheduling agent", description: "Manages calendar and appointments", dataAccess: ["Calendar"] },
  { id: "storage", name: "Storage agent", description: "Monitors file storage usage", dataAccess: ["Files", "Storage quota"] },
  { id: "media", name: "Media agent", description: "Organizes product and marketing media", dataAccess: ["Media library"] },
  { id: "analytics", name: "Analytics agent", description: "Analyzes business performance trends", dataAccess: ["Revenue", "Traffic", "Campaigns"] },
  { id: "finance", name: "Finance agent", description: "Tracks invoices and payments", dataAccess: ["Invoices", "Payments"] },
  { id: "product", name: "Product agent", description: "Tracks inventory and product data", dataAccess: ["Products", "Inventory"] },
  { id: "integration", name: "Integration agent", description: "Monitors connected apps", dataAccess: ["Integrations", "Sync logs"] },
  { id: "automation", name: "Automation agent", description: "Runs and monitors automations", dataAccess: ["Automations", "Automation logs"] },
];

export function findAgent(id: string) {
  return specializedAgents.find((a) => a.id === id);
}
