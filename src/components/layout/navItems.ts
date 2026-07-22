import type { IconName } from "../ui/Icon";

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

export const navItems: NavItem[] = [
  { label: "Home", path: "/", icon: "home" },
  { label: "Customers", path: "/customers", icon: "users" },
  { label: "Communications", path: "/communications", icon: "message" },
  { label: "Marketing", path: "/marketing", icon: "megaphone" },
  { label: "Tasks", path: "/tasks", icon: "briefcase" },
  { label: "Files", path: "/files", icon: "folder" },
  { label: "Analytics", path: "/analytics", icon: "bar-chart" },
  { label: "Settings", path: "/settings", icon: "settings" },
];
