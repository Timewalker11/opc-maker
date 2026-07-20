import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Skeleton } from "../ui/Skeleton";
import { useAuthStore } from "../../store/authStore";
import { useBusinessProfileStore } from "../../store/businessProfileStore";
import { useTasksStore } from "../../store/tasksStore";
import { selectTodaysPriorityTasks, isOverdue } from "../../mock/tasks";
import "./greeting-header.css";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader() {
  const authUser = useAuthStore((s) => s.user);
  const ownerName = useBusinessProfileStore((s) => s.profile?.ownerName);
  const firstName = (ownerName ?? authUser?.name ?? "there").split(" ")[0];

  const taskStatus = useTasksStore((s) => s.status);
  const taskItems = useTasksStore((s) => s.items);
  const loadTasks = useTasksStore((s) => s.load);
  const topTasks = useMemo(() => selectTodaysPriorityTasks(taskItems), [taskItems]);

  useEffect(() => {
    if (taskStatus === "idle") loadTasks();
  }, [taskStatus, loadTasks]);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="greeting-header">
      <div className="greeting-header__top">
        <h1 className="greeting-header__greeting">
          {getGreeting()}, {firstName}
        </h1>
        <span className="greeting-header__date">{today}</span>
      </div>

      {taskStatus === "loading" && (
        <div className="greeting-header__priorities">
          <Skeleton width={160} height={12} />
        </div>
      )}

      {taskStatus === "ready" && topTasks.length === 0 && (
        <p className="greeting-header__celebration">
          <Icon name="check" size={14} />
          All clear for today -- nothing urgent on your plate.
        </p>
      )}

      {taskStatus === "ready" && topTasks.length > 0 && (
        <div className="greeting-header__priorities">
          <p className="greeting-header__priorities-label">
            <Icon name="sparkles" size={13} />
            Today's priorities
          </p>
          <ul className="greeting-header__priorities-list">
            {topTasks.map((t) => (
              <li key={t.id}>
                {isOverdue(t) ? (
                  <Badge tone="critical">Overdue</Badge>
                ) : t.priority === "high" ? (
                  <Badge tone="warning">High</Badge>
                ) : null}
                <span className="truncate">{t.title}</span>
              </li>
            ))}
          </ul>
          <Link to="/work" className="card-link">
            View all tasks <Icon name="chevron-right" size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
