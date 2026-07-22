import type { ActivityType } from "../../types";
import type { IconName } from "../ui/Icon";
import { Icon } from "../ui/Icon";
import { Card } from "../ui/Card";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchActivity } from "../../services/activity";
import { formatRelativeTime } from "../../utils/format";
import { relatedHref } from "../../utils/relatedHref";
import { Link } from "react-router-dom";
import { useDashboardPanelsStore } from "../../store/dashboardPanelsStore";
import "./activity-feed.css";

const TYPE_ICON: Record<ActivityType, IconName> = {
  "customer-added": "users",
  "purchase-completed": "dollar-sign",
  "email-received": "mail",
  "invoice-paid": "check",
  "file-uploaded": "upload",
  "post-published": "send",
  "campaign-launched": "megaphone",
  "meeting-booked": "calendar",
  "task-completed": "clipboard-check",
  "agent-action": "bot",
};

export function ActivityFeed() {
  const { status, data, reload } = useDashboardData(fetchActivity);
  const collapsed = useDashboardPanelsStore((s) => s.activityCollapsed);
  const toggleCollapsed = useDashboardPanelsStore((s) => s.toggleActivity);

  return (
    <Card
      title="Recent activity"
      icon={<Icon name="clock" size={16} />}
      headerAction={
        <button
          className="ui-card__collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand recent activity" : "Collapse recent activity"}
          aria-expanded={!collapsed}
        >
          <Icon name={collapsed ? "chevron-down" : "chevron-up"} size={15} />
        </button>
      }
    >
      {!collapsed && (
        <>
          {status === "loading" && (
            <div className="activity-feed__skeletons">
              <CardSkeleton lines={1} />
              <CardSkeleton lines={1} />
              <CardSkeleton lines={1} />
            </div>
          )}
          {status === "error" && <ErrorState onRetry={reload} description="We couldn't load recent activity." />}
          {status === "ready" && (!data || data.length === 0) && (
            <EmptyState icon="clock" title="No activity yet" description="Business events will show up here as they happen." />
          )}
          {status === "ready" && data && data.length > 0 && (
            <ul className="activity-feed">
              {data.map((event) => (
                <li key={event.id} className="activity-feed__item">
                  <span className="activity-feed__icon">
                    <Icon name={TYPE_ICON[event.type]} size={14} />
                  </span>
                  <div className="activity-feed__body">
                    <p className="activity-feed__desc">{event.description}</p>
                    <div className="activity-feed__meta">
                      <span>{formatRelativeTime(event.timestamp)}</span>
                      {event.relatedTo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <Link to={relatedHref(event.relatedTo)} className="activity-feed__link">
                            {event.relatedTo.label}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
