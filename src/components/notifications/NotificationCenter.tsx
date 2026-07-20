import { useEffect, useMemo, useState } from "react";
import type { NotificationCategory } from "../../types";
import { Popover } from "../ui/Popover";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import type { BadgeTone } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { CardSkeleton } from "../ui/Skeleton";
import { useNotificationsStore, selectVisibleByCategory } from "../../store/notificationsStore";
import { useTasksStore } from "../../store/tasksStore";
import { formatRelativeTime } from "../../utils/format";
import "./notification-center.css";

const CATEGORY_ICON: Record<NotificationCategory, IconName> = {
  email: "mail",
  customer: "users",
  payment: "dollar-sign",
  task: "clipboard-check",
  calendar: "calendar",
  marketing: "megaphone",
  social: "image",
  integration: "plug",
  automation: "bot",
  agent: "sparkles",
  security: "shield",
};

const SEVERITY_TONE: Record<string, BadgeTone> = {
  info: "neutral",
  warning: "warning",
  serious: "serious",
  critical: "critical",
};

const CATEGORIES: Array<{ id: NotificationCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "email", label: "Email" },
  { id: "customer", label: "Customer" },
  { id: "payment", label: "Payment" },
  { id: "task", label: "Task" },
  { id: "calendar", label: "Calendar" },
  { id: "marketing", label: "Marketing" },
  { id: "social", label: "Social" },
  { id: "integration", label: "Integration" },
  { id: "automation", label: "Automation" },
  { id: "agent", label: "Agent" },
  { id: "security", label: "Security" },
];

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  labelledById: string;
}

export function NotificationCenter({ open, onClose, labelledById }: NotificationCenterProps) {
  const [category, setCategory] = useState<NotificationCategory | "all">("all");
  const status = useNotificationsStore((s) => s.status);
  const load = useNotificationsStore((s) => s.load);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const dismiss = useNotificationsStore((s) => s.dismiss);
  const snooze = useNotificationsStore((s) => s.snooze);
  const convertToTask = useNotificationsStore((s) => s.convertToTask);
  const allItems = useNotificationsStore((s) => s.items);
  const items = useMemo(() => selectVisibleByCategory(allItems, category), [allItems, category]);
  const addTask = useTasksStore((s) => s.addTask);

  useEffect(() => {
    if (open && status === "idle") load();
  }, [open, status, load]);

  if (!open) return null;

  function handleConvert(id: string, title: string) {
    addTask(title);
    convertToTask(id);
    dismiss(id);
  }

  return (
    <Popover open={open} onClose={onClose} className="notification-center" labelledById={labelledById} role="dialog">
      <div className="notification-center__header">
        <h2 id={labelledById}>Notifications</h2>
        <button className="notification-center__mark-all" onClick={markAllRead}>
          Mark all read
        </button>
      </div>

      <div className="notification-center__filters thin-scroll" role="tablist" aria-label="Filter notifications by category">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={category === c.id}
            className={`notification-center__filter ${category === c.id ? "notification-center__filter--active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="notification-center__list thin-scroll">
        {status === "loading" && (
          <div className="notification-center__loading">
            <CardSkeleton lines={2} />
            <CardSkeleton lines={2} />
          </div>
        )}
        {status === "error" && (
          <EmptyState icon="alert-triangle" title="Couldn't load notifications" description="Try reopening the panel." compact />
        )}
        {status === "ready" && items.length === 0 && (
          <EmptyState icon="bell" title="You're all caught up" description="No notifications in this category." compact />
        )}
        {status === "ready" &&
          items.map((n) => (
            <div key={n.id} className={`notification-item ${!n.read ? "notification-item--unread" : ""}`}>
              <span className="notification-item__icon">
                <Icon name={CATEGORY_ICON[n.category]} size={15} />
              </span>
              <div className="notification-item__body">
                <div className="notification-item__title-row">
                  <p className="notification-item__title">{n.title}</p>
                  <Badge tone={SEVERITY_TONE[n.severity]}>{n.severity}</Badge>
                </div>
                <p className="notification-item__desc">{n.description}</p>
                <div className="notification-item__meta">
                  <span>{formatRelativeTime(n.timestamp)}</span>
                  <div className="notification-item__actions">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} aria-label="Mark as read">
                        <Icon name="check" size={13} />
                      </button>
                    )}
                    <button onClick={() => snooze(n.id, 60)} aria-label="Snooze for 1 hour">
                      <Icon name="clock" size={13} />
                    </button>
                    <button onClick={() => handleConvert(n.id, n.title)} aria-label="Convert to task">
                      <Icon name="clipboard-check" size={13} />
                    </button>
                    <button onClick={() => dismiss(n.id)} aria-label="Dismiss notification">
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Popover>
  );
}
