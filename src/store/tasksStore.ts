import { create } from "zustand";
import type { TaskItem } from "../types";
import { fetchTasks, setTaskDone } from "../services/tasks";

let newTaskCounter = 0;

interface TasksState {
  items: TaskItem[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  addTask: (title: string, dueInHours?: number) => void;
  seedDemo: () => void;
}

const HOUR = 60 * 60 * 1000;

export const useTasksStore = create<TasksState>()((set, get) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchTasks();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  toggleDone: async (id) => {
    const task = get().items.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    set((s) => ({ items: s.items.map((t) => (t.id === id ? { ...t, done } : t)) }));
    await setTaskDone(id, done);
  },
  addTask: (title, dueInHours = 24) => {
    newTaskCounter += 1;
    const task: TaskItem = {
      id: `task_manual_${newTaskCounter}`,
      title,
      dueAt: new Date(Date.now() + dueInHours * 60 * 60 * 1000).toISOString(),
      priority: "medium",
      done: false,
    };
    set((s) => ({ items: [task, ...s.items] }));
  },
  seedDemo: () => {
    const now = Date.now();
    const items: TaskItem[] = [
      { id: "task_demo_1", title: "Follow up with wholesale supplier", dueAt: new Date(now - 26 * HOUR).toISOString(), priority: "high", done: false },
      { id: "task_demo_2", title: "Reply to Priya's custom order question", dueAt: new Date(now + 3 * HOUR).toISOString(), priority: "high", done: false },
      { id: "task_demo_3", title: "Post this week's product photos", dueAt: new Date(now + 8 * HOUR).toISOString(), priority: "medium", done: false },
      { id: "task_demo_4", title: "Reconcile last month's invoices", dueAt: new Date(now + 30 * HOUR).toISOString(), priority: "medium", done: false },
      { id: "task_demo_5", title: "Order more packaging materials", dueAt: new Date(now + 72 * HOUR).toISOString(), priority: "low", done: false },
      { id: "task_demo_6", title: "Renew business insurance", dueAt: new Date(now - 5 * HOUR).toISOString(), priority: "medium", done: true },
    ];
    set({ items, status: "ready" });
  },
}));
