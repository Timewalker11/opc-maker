import { useEffect } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useTasksStore } from "../store/tasksStore";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchUpcomingEvents } from "../services/calendar";
import { isOverdue } from "../mock/tasks";
import { formatDay, formatTime } from "../utils/format";

export function Work() {
  const taskStatus = useTasksStore((s) => s.status);
  const tasks = useTasksStore((s) => s.items);
  const loadTasks = useTasksStore((s) => s.load);
  const toggleDone = useTasksStore((s) => s.toggleDone);
  const events = useDashboardData(fetchUpcomingEvents);

  useEffect(() => {
    if (taskStatus === "idle") loadTasks();
  }, [taskStatus, loadTasks]);

  const taskList = tasks;
  const eventList = events.data ?? [];

  return (
    <div>
      <PageHeader title="Work" description="Tasks and appointments across your business." />
      <div className="page-grid">
        <Card title={`Tasks (${taskList.filter((t) => !t.done).length} open)`}>
          {taskStatus === "loading" && <CardSkeleton lines={5} />}
          {taskStatus === "error" && <ErrorState onRetry={loadTasks} />}
          {taskStatus === "ready" && taskList.length === 0 && (
            <EmptyState icon="clipboard-check" title="No tasks yet" description="Create your first task to start tracking your work." />
          )}
          {taskStatus === "ready" && taskList.length > 0 && (
            <ul className="record-list">
              {taskList.map((t) => (
                <li key={t.id} className="record-row">
                  <label className="record-row__main record-row__checkbox-row">
                    <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} aria-label={`Mark "${t.title}" done`} />
                    <span className={t.done ? "record-row__title record-row__title--done" : "record-row__title"}>{t.title}</span>
                  </label>
                  {isOverdue(t) && <Badge tone="critical">Overdue</Badge>}
                  {!t.done && !isOverdue(t) && t.priority === "high" && <Badge tone="warning">High priority</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Calendar">
          {events.status === "loading" && <CardSkeleton lines={4} />}
          {events.status === "error" && <ErrorState onRetry={events.reload} />}
          {events.status === "ready" && eventList.length === 0 && (
            <EmptyState icon="calendar" title="Nothing scheduled" description="Connect your calendar to see appointments here." />
          )}
          {events.status === "ready" && eventList.length > 0 && (
            <ul className="record-list">
              {eventList.map((ev) => (
                <li key={ev.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{ev.title}</p>
                    {ev.relatedTo && <p className="record-row__subtitle">{ev.relatedTo.label}</p>}
                  </div>
                  <span className="record-row__subtitle">
                    {formatDay(ev.startAt)}, {formatTime(ev.startAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
