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
}

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
}));
