import { create } from "zustand";
import type { AppNotification, NotificationCategory } from "../types";
import { fetchNotifications } from "../services/notifications";

interface NotificationsState {
  items: AppNotification[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  snooze: (id: string, minutes: number) => void;
  convertToTask: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchNotifications();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  dismiss: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, dismissed: true } : n)) })),
  snooze: (id, minutes) =>
    set((s) => ({
      items: s.items.map((n) =>
        n.id === id ? { ...n, snoozedUntil: new Date(Date.now() + minutes * 60_000).toISOString() } : n,
      ),
    })),
  convertToTask: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
}));

// Plain helpers (not store selectors) -- call from a component's useMemo, keyed on `items`,
// so the derived array/number is only recomputed when the underlying data actually changes.
export function selectUnreadCount(items: AppNotification[]): number {
  return items.filter((n) => !n.read && !n.dismissed).length;
}

export function selectVisibleByCategory(
  items: AppNotification[],
  category: NotificationCategory | "all",
): AppNotification[] {
  return items.filter((n) => {
    if (n.dismissed) return false;
    if (n.snoozedUntil && new Date(n.snoozedUntil).getTime() > Date.now()) return false;
    return category === "all" || n.category === category;
  });
}
