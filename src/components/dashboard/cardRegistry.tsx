import type { DashboardCardId } from "../../types";
import type { IconName } from "../ui/Icon";
import { RevenueCard } from "./RevenueCard";
import { NewCustomersCard } from "./NewCustomersCard";
import { TasksCard } from "./TasksCard";
import { CalendarCard } from "./CalendarCard";
import { SocialPostsCard } from "./SocialPostsCard";
import { EmailsCard } from "./EmailsCard";
import { StorageCard } from "./StorageCard";
import { AlertsCard } from "./AlertsCard";

export const CARD_REGISTRY: Record<DashboardCardId, { label: string; icon: IconName; Component: React.ComponentType }> = {
  revenue: { label: "Revenue summary", icon: "dollar-sign", Component: RevenueCard },
  customers: { label: "New customers", icon: "users", Component: NewCustomersCard },
  tasks: { label: "Tasks due today", icon: "clipboard-check", Component: TasksCard },
  calendar: { label: "Upcoming events", icon: "calendar", Component: CalendarCard },
  social: { label: "Scheduled social posts", icon: "megaphone", Component: SocialPostsCard },
  emails: { label: "Unread emails", icon: "mail", Component: EmailsCard },
  storage: { label: "Storage", icon: "database", Component: StorageCard },
  alerts: { label: "Alerts and problems", icon: "alert-triangle", Component: AlertsCard },
};
