import type { TaskItem } from "../types";

export const tasks: TaskItem[] = [];

export function isOverdue(task: TaskItem): boolean {
  return !task.done && new Date(task.dueAt).getTime() < Date.now();
}

export function isDueToday(task: TaskItem): boolean {
  const due = new Date(task.dueAt);
  const now = new Date();
  return due.toDateString() === now.toDateString();
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// Today's must-dos: overdue or due today, ranked by priority (overdue first within a tier).
export function selectTodaysPriorityTasks(items: TaskItem[], limit = 3): TaskItem[] {
  const relevant = items.filter((t) => !t.done && (isOverdue(t) || isDueToday(t)));
  return [...relevant]
    .sort(
      (a, b) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || (isOverdue(b) ? 1 : 0) - (isOverdue(a) ? 1 : 0),
    )
    .slice(0, limit);
}
