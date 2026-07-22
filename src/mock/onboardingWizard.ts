import type { AIInvolvementLevel, BusinessType, ChallengeId, HelpAreaId, SellType, SpecializedAgentId, TeamSize, ToolId } from "../types";
import type { IconName } from "../components/ui/Icon";

export interface OptionDef<T extends string> {
  value: T;
  label: string;
  icon: IconName;
}

export const BUSINESS_TYPE_OPTIONS: OptionDef<BusinessType>[] = [
  { value: "retail-ecommerce", label: "Retail / Ecommerce", icon: "package" },
  { value: "professional-services", label: "Professional Services", icon: "briefcase" },
  { value: "realtor", label: "Realtor", icon: "home" },
  { value: "consultant", label: "Consultant", icon: "handshake" },
  { value: "freelancer", label: "Freelancer", icon: "edit" },
  { value: "creator", label: "Creator", icon: "camera" },
  { value: "agency", label: "Agency", icon: "megaphone" },
  { value: "restaurant", label: "Restaurant", icon: "utensils" },
  { value: "healthcare", label: "Healthcare", icon: "heart-pulse" },
  { value: "education", label: "Education", icon: "graduation-cap" },
  { value: "software", label: "Software", icon: "database" },
  { value: "manufacturing", label: "Manufacturing", icon: "factory" },
  { value: "construction", label: "Construction", icon: "hammer" },
  { value: "nonprofit", label: "Nonprofit", icon: "globe" },
  { value: "other", label: "Other", icon: "grid" },
];

export const SELL_TYPE_OPTIONS: OptionDef<SellType>[] = [
  { value: "physical-products", label: "Physical products", icon: "package" },
  { value: "digital-products", label: "Digital products", icon: "download" },
  { value: "services", label: "Services", icon: "handshake" },
  { value: "memberships", label: "Memberships", icon: "credit-card" },
  { value: "courses", label: "Courses", icon: "graduation-cap" },
  { value: "subscriptions", label: "Subscriptions", icon: "repeat" },
  { value: "software", label: "Software", icon: "database" },
  { value: "multiple", label: "Multiple", icon: "grid" },
];

export const TEAM_SIZE_OPTIONS: OptionDef<TeamSize>[] = [
  { value: "solo", label: "Just me", icon: "user-circle" },
  { value: "small", label: "2–5", icon: "users" },
  { value: "medium", label: "6–20", icon: "users" },
  { value: "large", label: "21+", icon: "users" },
];

export const CHALLENGE_OPTIONS: OptionDef<ChallengeId>[] = [
  { value: "customer-management", label: "Customer management", icon: "users" },
  { value: "lead-followup", label: "Following up with leads", icon: "trending-up" },
  { value: "email", label: "Email", icon: "mail" },
  { value: "marketing", label: "Marketing", icon: "megaphone" },
  { value: "social-media", label: "Social media", icon: "instagram" },
  { value: "scheduling", label: "Scheduling", icon: "calendar" },
  { value: "invoices", label: "Invoices", icon: "receipt" },
  { value: "payments", label: "Payments", icon: "credit-card" },
  { value: "analytics", label: "Analytics", icon: "bar-chart" },
  { value: "file-organization", label: "Organizing files", icon: "folder" },
  { value: "project-management", label: "Project management", icon: "clipboard-check" },
  { value: "too-many-apps", label: "Too many apps", icon: "layers" },
  { value: "repetitive-work", label: "Repetitive work", icon: "repeat" },
  { value: "remembering-tasks", label: "Remembering tasks", icon: "clock" },
  { value: "automation", label: "Automation", icon: "zap" },
];

export const HELP_AREA_OPTIONS: OptionDef<HelpAreaId>[] = [
  { value: "growing-sales", label: "Growing sales", icon: "trending-up" },
  { value: "organizing-customers", label: "Organizing customers", icon: "users" },
  { value: "managing-email", label: "Managing email", icon: "mail" },
  { value: "marketing", label: "Marketing", icon: "megaphone" },
  { value: "social-media", label: "Social media", icon: "instagram" },
  { value: "scheduling", label: "Scheduling", icon: "calendar" },
  { value: "automating-work", label: "Automating repetitive work", icon: "zap" },
  { value: "file-organization", label: "File organization", icon: "folder" },
  { value: "analytics", label: "Analytics", icon: "bar-chart" },
  { value: "saving-time", label: "Saving time", icon: "clock" },
];

export interface ToolDef {
  value: ToolId;
  label: string;
  initials: string;
  color: string;
}

// Colors are distinct, brand-adjacent accents used purely as a placeholder monogram badge --
// not a reproduction of any company's real logo or exact brand color.
export const TOOL_OPTIONS: ToolDef[] = [
  { value: "gmail", label: "Gmail", initials: "Gm", color: "#d93025" },
  { value: "outlook", label: "Outlook", initials: "Ou", color: "#0a66c2" },
  { value: "google-calendar", label: "Google Calendar", initials: "Ca", color: "#1a73e8" },
  { value: "google-drive", label: "Google Drive", initials: "Dr", color: "#34a853" },
  { value: "shopify", label: "Shopify", initials: "Sh", color: "#95bf47" },
  { value: "stripe", label: "Stripe", initials: "St", color: "#635bff" },
  { value: "square", label: "Square", initials: "Sq", color: "#3e4348" },
  { value: "tiktok", label: "TikTok", initials: "Tk", color: "#010101" },
  { value: "instagram", label: "Instagram", initials: "Ig", color: "#c1367f" },
  { value: "facebook", label: "Facebook", initials: "Fb", color: "#1877f2" },
  { value: "mailchimp", label: "Mailchimp", initials: "Mc", color: "#ffe01b" },
  { value: "quickbooks", label: "QuickBooks", initials: "Qb", color: "#2ca01c" },
  { value: "dropbox", label: "Dropbox", initials: "Db", color: "#0061ff" },
  { value: "notion", label: "Notion", initials: "No", color: "#2f2f2f" },
  { value: "slack", label: "Slack", initials: "Sl", color: "#611f69" },
  { value: "hubspot", label: "HubSpot", initials: "Hs", color: "#ff7a59" },
  { value: "salesforce", label: "Salesforce", initials: "Sf", color: "#00a1e0" },
  { value: "canva", label: "Canva", initials: "Cv", color: "#00c4cc" },
  { value: "etsy", label: "Etsy", initials: "Et", color: "#f1641e" },
  { value: "amazon", label: "Amazon", initials: "Am", color: "#ff9900" },
];

export interface AIInvolvementOption {
  value: AIInvolvementLevel;
  name: string;
  description: string;
  icon: IconName;
}

export const AI_INVOLVEMENT_OPTIONS: AIInvolvementOption[] = [
  { value: "assistant", name: "Assistant", description: "AI gives recommendations only.", icon: "eye" },
  {
    value: "copilot",
    name: "Copilot",
    description: "AI drafts work and asks for approval before taking action.",
    icon: "edit",
  },
  {
    value: "autopilot",
    name: "Guided Autopilot",
    description:
      "AI can complete approved workflow categories automatically while still requesting approval for sensitive actions.",
    icon: "zap",
  },
];

export interface WizardAgentOption {
  id: SpecializedAgentId;
  name: string;
  description: string;
  icon: IconName;
}

export const WIZARD_AGENT_OPTIONS: WizardAgentOption[] = [
  { id: "customer", name: "Customer Agent", description: "Organizes customer records, relationship history, and follow-ups.", icon: "users" },
  { id: "email", name: "Email Agent", description: "Prioritizes emails, drafts replies, and manages your inbox.", icon: "mail" },
  { id: "marketing", name: "Marketing Agent", description: "Plans campaigns, tracks results, and recommends improvements.", icon: "megaphone" },
  { id: "social", name: "Social Media Agent", description: "Creates, schedules, and analyzes social content.", icon: "instagram" },
  { id: "sales", name: "Sales Agent", description: "Tracks leads, opportunities, and recommended next actions.", icon: "trending-up" },
  { id: "task", name: "Task & Project Agent", description: "Organizes projects, deadlines, and daily work.", icon: "clipboard-check" },
  { id: "scheduling", name: "Calendar Agent", description: "Schedules appointments and manages reminders.", icon: "calendar" },
  { id: "finance", name: "Finance Agent", description: "Monitors invoices, payments, expenses, and financial summaries.", icon: "dollar-sign" },
  { id: "analytics", name: "Analytics Agent", description: "Explains trends and generates reports.", icon: "bar-chart" },
  { id: "storage", name: "File & Storage Agent", description: "Organizes documents, media, and business files.", icon: "folder" },
  { id: "automation", name: "Automation Agent", description: "Creates workflows between connected applications.", icon: "zap" },
  { id: "integration", name: "Integration Agent", description: "Connects and monitors third-party applications.", icon: "plug" },
];

export const MAX_STARTING_AGENTS = 3;
