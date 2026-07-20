import type { TaskItem } from "../types";
import { tasks } from "../mock/tasks";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/tasks
export function fetchTasks(): Promise<TaskItem[]> {
  return mockRequest(tasks);
}

// Integration placeholder: PATCH /api/tasks/:id { done }
export function setTaskDone(_id: string, done: boolean): Promise<{ success: boolean }> {
  return mockRequest({ success: true }, { latencyMs: 200 }).then((r) => ({ ...r, done } as { success: boolean }));
}
