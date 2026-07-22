import { create } from "zustand";
import type { CalendarEvent } from "../types";
import { fetchUpcomingEvents } from "../services/calendar";

let newEventCounter = 0;

interface CalendarState {
  items: CalendarEvent[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  addEvent: (input: { title: string; startAt: string; durationMinutes: number; location: CalendarEvent["location"] }) => void;
  seedDemo: () => void;
}

const HOUR = 60 * 60 * 1000;

export const useCalendarStore = create<CalendarState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchUpcomingEvents();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  addEvent: ({ title, startAt, durationMinutes, location }) => {
    newEventCounter += 1;
    const event: CalendarEvent = {
      id: `event_manual_${newEventCounter}`,
      title,
      startAt,
      durationMinutes,
      location,
    };
    set((s) => ({ items: [...s.items, event].sort((a, b) => a.startAt.localeCompare(b.startAt)) }));
  },
  seedDemo: () => {
    const now = Date.now();
    const items: CalendarEvent[] = [
      { id: "event_demo_1", title: "Client onboarding call", startAt: new Date(now + 5 * HOUR).toISOString(), durationMinutes: 30, location: "video-call" },
      { id: "event_demo_2", title: "Supplier check-in", startAt: new Date(now + 26 * HOUR).toISOString(), durationMinutes: 20, location: "phone" },
      { id: "event_demo_3", title: "Photoshoot for new collection", startAt: new Date(now + 48 * HOUR).toISOString(), durationMinutes: 180, location: "in-person" },
      { id: "event_demo_4", title: "Team weekly sync", startAt: new Date(now + 72 * HOUR).toISOString(), durationMinutes: 45, location: "video-call" },
      { id: "event_demo_5", title: "Investor update call", startAt: new Date(now + 120 * HOUR).toISOString(), durationMinutes: 60, location: "video-call" },
    ];
    set({ items: items.sort((a, b) => a.startAt.localeCompare(b.startAt)), status: "ready" });
  },
}));
