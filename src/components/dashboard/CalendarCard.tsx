import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useCalendarStore } from "../../store/calendarStore";
import { formatDay, formatTime } from "../../utils/format";
import "./calendar-card.css";
import "./card-detail.css";

export function CalendarCard() {
  const status = useCalendarStore((s) => s.status);
  const allEvents = useCalendarStore((s) => s.items);
  const load = useCalendarStore((s) => s.load);
  const events = allEvents.slice(0, 3);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  return (
    <Card
      title="Upcoming events"
      icon={<Icon name="calendar" size={16} />}
      headerAction={
        <Link to="/tasks" className="card-link">
          Open calendar <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && events.length === 0 && (
        <EmptyState
          icon="calendar"
          title="Nothing scheduled"
          description="Connect your calendar to see upcoming appointments here."
          compact
          action={
            <Link to="/settings#integrations" className="card-link">
              Connect calendar <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && events.length > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View all upcoming events">
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
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Upcoming events">
        <div className="card-detail">
          {allEvents.length === 0 && <p className="card-detail__empty">Nothing scheduled.</p>}
          {allEvents.length > 0 && (
            <ul className="card-detail__list">
              {allEvents.map((ev) => (
                <li key={ev.id} className="card-detail__row">
                  <div className="card-detail__row-body">
                    <p className="card-detail__row-title">{ev.title}</p>
                    <p className="card-detail__row-meta">
                      {formatDay(ev.startAt)}, {formatTime(ev.startAt)} &middot; {ev.durationMinutes} min &middot; {ev.location}
                      {ev.relatedTo ? ` · ${ev.relatedTo.label}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}
