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
import { useCustomersStore } from "../../store/customersStore";
import { formatRelativeTime } from "../../utils/format";
import "./new-customers-card.css";
import "./card-detail.css";

const DAY = 24 * 60 * 60 * 1000;

export function NewCustomersCard() {
  const status = useCustomersStore((s) => s.status);
  const customers = useCustomersStore((s) => s.items);
  const load = useCustomersStore((s) => s.load);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  const thisWeekCutoff = Date.now() - 7 * DAY;
  const lastWeekCutoff = Date.now() - 14 * DAY;
  const newThisWeek = customers.filter((c) => new Date(c.createdAt).getTime() > thisWeekCutoff);
  const thisWeek = newThisWeek.length;
  const lastWeek = Math.max(
    customers.filter((c) => {
      const t = new Date(c.createdAt).getTime();
      return t <= thisWeekCutoff && t > lastWeekCutoff;
    }).length,
    1,
  );
  const sourceCounts = new Map<string, number>();
  for (const c of customers) sourceCounts.set(c.source, (sourceCounts.get(c.source) ?? 0) + 1);
  const topSource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Direct";

  return (
    <Card
      title="New customers"
      icon={<Icon name="users" size={16} />}
      headerAction={
        <Link to="/customers" className="card-link">
          All customers <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={1} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && thisWeek === 0 && (
        <EmptyState
          icon="users"
          title="No new customers yet"
          description="Import your existing customers or connect a store to start tracking growth."
          compact
          action={
            <Link to="/customers" className="card-link">
              Import customers <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && thisWeek > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View new customer details">
          <div className="new-customers-card">
            <p className="new-customers-card__figure">{thisWeek}</p>
            <NewCustomersDelta thisWeek={thisWeek} lastWeek={lastWeek} />
            <p className="new-customers-card__source">
              Top source: <strong>{topSource}</strong>
            </p>
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="New customers">
        <div className="card-detail">
          <div className="card-detail__stats">
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">This week</span>
              <span className="card-detail__stat-value">{thisWeek}</span>
            </div>
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Last week</span>
              <span className="card-detail__stat-value">{lastWeek}</span>
            </div>
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Top source</span>
              <span className="card-detail__stat-value">{topSource}</span>
            </div>
          </div>
          <p className="card-detail__heading">New this week</p>
          {newThisWeek.length === 0 && <p className="card-detail__empty">No new customers this week.</p>}
          {newThisWeek.length > 0 && (
            <ul className="card-detail__list">
              {newThisWeek.map((c) => (
                <li key={c.id} className="card-detail__row">
                  <div className="card-detail__row-body">
                    <p className="card-detail__row-title">{c.name}</p>
                    <p className="card-detail__row-meta">
                      {c.email} &middot; via {c.source}
                    </p>
                  </div>
                  <span className="card-detail__row-meta">{formatRelativeTime(c.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}

function NewCustomersDelta({ thisWeek, lastWeek }: { thisWeek: number; lastWeek: number }) {
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  const positive = pct >= 0;
  return (
    <Badge tone={positive ? "good" : "critical"} icon={<Icon name={positive ? "arrow-up-right" : "arrow-down-right"} size={11} />}>
      {positive ? "+" : ""}
      {pct}% vs last week
    </Badge>
  );
}
