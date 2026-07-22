import type { IconName } from "../components/ui/Icon";

export type BusinessType =
  | "retail-ecommerce"
  | "professional-services"
  | "realtor"
  | "consultant"
  | "freelancer"
  | "creator"
  | "agency"
  | "restaurant"
  | "healthcare"
  | "education"
  | "software"
  | "manufacturing"
  | "construction"
  | "nonprofit"
  | "other";

export type ReferralSource = "search" | "social" | "referral" | "ad" | "other";

export interface AuthUser {
  name: string;
  email: string;
}

export interface BusinessProfile {
  companyName: string;
  businessType: BusinessType;
  referralSource: ReferralSource;
  ownerName: string;
}

export type SellType =
  | "physical-products"
  | "digital-products"
  | "services"
  | "memberships"
  | "courses"
  | "subscriptions"
  | "software"
  | "multiple";

export type TeamSize = "solo" | "small" | "medium" | "large";

export type ChallengeId =
  | "customer-management"
  | "lead-followup"
  | "email"
  | "marketing"
  | "social-media"
  | "scheduling"
  | "invoices"
  | "payments"
  | "analytics"
  | "file-organization"
  | "project-management"
  | "too-many-apps"
  | "repetitive-work"
  | "remembering-tasks"
  | "automation";

export type ToolId =
  | "gmail"
  | "outlook"
  | "google-calendar"
  | "google-drive"
  | "shopify"
  | "stripe"
  | "square"
  | "tiktok"
  | "instagram"
  | "facebook"
  | "mailchimp"
  | "quickbooks"
  | "dropbox"
  | "notion"
  | "slack"
  | "hubspot"
  | "salesforce"
  | "canva"
  | "etsy"
  | "amazon";

export type HelpAreaId =
  | "growing-sales"
  | "organizing-customers"
  | "managing-email"
  | "marketing"
  | "social-media"
  | "scheduling"
  | "automating-work"
  | "file-organization"
  | "analytics"
  | "saving-time";

export type AIInvolvementLevel = "assistant" | "copilot" | "autopilot";

export interface OnboardingAnswers {
  companyName: string;
  businessType: BusinessType | null;
  businessDescription: string;
  sellTypes: SellType[];
  teamSize: TeamSize | null;
  challenges: ChallengeId[];
  tools: ToolId[];
  otherTools: string;
  helpAreas: HelpAreaId[];
  aiInvolvement: AIInvolvementLevel | null;
  selectedAgents: SpecializedAgentId[];
}

// A real, backend-registered OAuth integration -- distinct from the mock `Integration` type
// below, which only feeds the illustrative global-search index.
export interface IntegrationInfo {
  id: string;
  name: string;
  category: string;
  configured: boolean;
  connected: boolean;
  connectedAt: string | null;
}

export type Priority = "low" | "medium" | "high";
export type Severity = "info" | "warning" | "serious" | "critical";
export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "tiktok";
export type PostStatus = "draft" | "scheduled" | "published";
export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface RelatedRecord {
  type: "customer" | "campaign" | "task" | "file" | "invoice" | "order" | "project" | "email";
  id: string;
  label: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  source: string;
  createdAt: string;
  lifetimeValue: number;
  lastPurchaseAt: string | null;
  tags: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  dueAt: string;
  priority: Priority;
  done: boolean;
  relatedTo?: RelatedRecord;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  durationMinutes: number;
  relatedTo?: RelatedRecord;
  location: "video-call" | "phone" | "in-person";
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  caption: string;
  scheduledAt: string;
  status: PostStatus;
}

export interface EmailMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
  urgent: boolean;
  needsResponse: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: string;
  kind: "image" | "document" | "spreadsheet" | "media";
  relatedTo?: RelatedRecord;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  dueAt: string;
  status: "paid" | "overdue" | "pending";
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  createdAt: string;
  source: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "active" | "paused" | "ended";
  purchasesGenerated: number;
  spend: number;
  performance: "underperforming" | "on-track" | "top-performer";
}

export interface Note {
  id: string;
  content: string;
  relatedTo?: RelatedRecord;
  createdAt: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  lastSyncedAt: string | null;
}

export interface AlertItem {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  detectedAt: string;
  recommendedAction: string;
  actionLabel: string;
  resolved: boolean;
}

export type ActivityType =
  | "customer-added"
  | "purchase-completed"
  | "email-received"
  | "invoice-paid"
  | "file-uploaded"
  | "post-published"
  | "campaign-launched"
  | "meeting-booked"
  | "task-completed"
  | "agent-action";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  description: string;
  relatedTo?: RelatedRecord;
  timestamp: string;
}

export type SensitiveActionType =
  | "send-email"
  | "publish-post"
  | "charge-customer"
  | "delete-file"
  | "modify-payment"
  | "contact-customer"
  | null;

export interface Recommendation {
  id: string;
  title: string;
  explanation: string;
  benefit: string;
  priority: Priority;
  suggestedAction: string;
  sensitiveAction: SensitiveActionType;
  status: "pending" | "approved" | "dismissed";
}

export type NotificationCategory =
  | "email"
  | "customer"
  | "payment"
  | "task"
  | "calendar"
  | "marketing"
  | "social"
  | "integration"
  | "automation"
  | "agent"
  | "security";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  severity: Severity;
  read: boolean;
  snoozedUntil: string | null;
  dismissed: boolean;
}

export type SpecializedAgentId =
  | "customer"
  | "email"
  | "marketing"
  | "social"
  | "sales"
  | "task"
  | "scheduling"
  | "storage"
  | "media"
  | "analytics"
  | "finance"
  | "product"
  | "integration"
  | "automation";

export interface SpecializedAgent {
  id: SpecializedAgentId;
  name: string;
  description: string;
  dataAccess: string[];
  icon: IconName;
}

export interface AgentRouting {
  agentId: SpecializedAgentId;
  dataAccess: string[];
  proposedAction: string;
  requiresApproval: boolean;
  status: "pending" | "running" | "needs-approval" | "success" | "failed";
}

export interface AgentSource {
  label: string;
  section: string;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  routing?: AgentRouting[];
  sources?: AgentSource[];
  reasoning?: string;
  undoable?: boolean;
}

export type DashboardCardId =
  | "revenue"
  | "customers"
  | "tasks"
  | "calendar"
  | "social"
  | "emails"
  | "storage"
  | "alerts";

export type CardSize = "sm" | "md" | "lg";

export interface DashboardCardConfig {
  id: DashboardCardId;
  visible: boolean;
  size: CardSize;
}

export interface OnboardingStep {
  id: string;
  label: string;
  done: boolean;
  href: string;
}

export type SearchCategory =
  | "customers"
  | "emails"
  | "tasks"
  | "events"
  | "files"
  | "media"
  | "orders"
  | "invoices"
  | "campaigns"
  | "notes"
  | "posts"
  | "integrations";

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  meta: string;
  href: string;
}

export interface CommandSuggestion {
  id: string;
  label: string;
}
