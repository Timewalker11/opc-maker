import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useTasksStore } from "../../store/tasksStore";
import { isOverdue, isDueToday } from "../../mock/tasks";
import "./tasks-card.css";
import "./card-detail.css";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function TasksCard() {
  const status = useTasksStore((s) => s.status);
  const items = useTasksStore((s) => s.items);
  const load = useTasksStore((s) => s.load);
  const toggleDone = useTasksStore((s) => s.toggleDone);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  const overdue = items.filter(isOverdue);
  const dueToday = items.filter((t) => !t.done && isDueToday(t));
  const topThree = [...items]
    .filter((t) => !t.done)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || (isOverdue(b) ? 1 : 0) - (isOverdue(a) ? 1 : 0))
    .slice(0, 3);

  return (
    <Card
      title="Tasks due today"
      icon={<Icon name="clipboard-check" size={16} />}
      headerAction={
        <Link to="/tasks" className="card-link">
          View all tasks <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && items.length === 0 && (
        <EmptyState icon="clipboard-check" title="No tasks yet" description="Create your first task to start tracking your work." compact />
      )}
      {status === "ready" && items.length > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View all tasks">
          <div className="tasks-card">
            <div className="tasks-card__counts">
              <span className="tasks-card__count">
                <strong>{dueToday.length}</strong> due today
              </span>
              {overdue.length > 0 && <Badge tone="critical">{overdue.length} overdue</Badge>}
            </div>
            {topThree.length === 0 ? (
              <p className="tasks-card__all-done">All caught up -- nothing pending.</p>
            ) : (
              <ul className="tasks-card__list">
                {topThree.map((t) => (
                  <li key={t.id} className="tasks-card__item">
                    {/* not a <label> -- inside a clickable card, label-forwarding would silently
                        toggle "done" on every click meant to open the details popup */}
                    <span className="tasks-card__checkbox-row">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleDone(t.id)}
                        aria-label={`Mark "${t.title}" as done`}
                      />
                      <span className="truncate">{t.title}</span>
                    </span>
                    {isOverdue(t) && <Badge tone="critical">Overdue</Badge>}
                    {!isOverdue(t) && t.priority === "high" && <Badge tone="warning">High</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="All tasks">
        <div className="card-detail">
          {items.length === 0 && <p className="card-detail__empty">No tasks yet.</p>}
          {items.length > 0 && (
            <ul className="card-detail__list">
              {[...items]
                .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
                .map((t) => (
                  <li key={t.id} className="card-detail__row">
                    <label className="tasks-card__checkbox-row">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleDone(t.id)}
                        aria-label={`Mark "${t.title}" as done`}
                      />
                      <div className="card-detail__row-body">
                        <p className={`card-detail__row-title ${t.done ? "tasks-card__done-title" : ""}`}>{t.title}</p>
                        <p className="card-detail__row-meta">Due {isDueToday(t) ? "today" : new Date(t.dueAt).toLocaleDateString()}</p>
                      </div>
                    </label>
                    {isOverdue(t) && <Badge tone="critical">Overdue</Badge>}
                    {!isOverdue(t) && t.priority === "high" && <Badge tone="warning">High</Badge>}
                    {!isOverdue(t) && t.priority === "medium" && <Badge tone="neutral">Medium</Badge>}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}
