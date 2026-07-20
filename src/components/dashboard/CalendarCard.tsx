import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchUpcomingEvents } from "../../services/calendar";
import { formatDay, formatTime } from "../../utils/format";
import "./calendar-card.css";

export function CalendarCard() {
  const { status, data, reload } = useDashboardData(fetchUpcomingEvents);
  const events = (data ?? []).slice(0, 3);

  return (
    <Card
      title="Upcoming events"
      icon={<Icon name="calendar" size={16} />}
      headerAction={
        <Link to="/work" className="card-link">
          Open calendar <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={reload} />}
      {status === "ready" && events.length === 0 && (
        <EmptyState
          icon="calendar"
          title="Nothing scheduled"
          description="Connect your calendar to see upcoming appointments here."
          compact
          action={
            <Link to="/integrations" className="card-link">
              Connect calendar <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && events.length > 0 && (
        <ul className="calendar-card">
          {events.map((ev) => (
            <li key={ev.id} className="calendar-card__item">
              <div className="calendar-card__time">
                <span className="calendar-card__day">{formatDay(ev.startAt)}</span>
                <span>{formatTime(ev.startAt)}</span>
              </div>
              <div className="calendar-card__body">
                <p className="calendar-card__title truncate">{ev.title}</p>
                {ev.relatedTo && <p className="calendar-card__related truncate">{ev.relatedTo.label}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
