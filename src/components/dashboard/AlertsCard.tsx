import { useEffect, useState } from "react";
import type { Severity } from "../../types";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import type { BadgeTone } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useAlertsStore } from "../../store/alertsStore";
import { formatRelativeTime } from "../../utils/format";
import "./alerts-card.css";
import "./card-detail.css";

const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  info: "neutral",
  warning: "warning",
  serious: "serious",
  critical: "critical",
};

export function AlertsCard() {
  const status = useAlertsStore((s) => s.status);
  const items = useAlertsStore((s) => s.items);
  const load = useAlertsStore((s) => s.load);
  const resolve = useAlertsStore((s) => s.resolve);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  const open = items.filter((a) => !a.resolved).sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  const resolved = items.filter((a) => a.resolved).sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Card title="Alerts and problems" icon={<Icon name="alert-triangle" size={16} />}>
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && open.length === 0 && (
        <EmptyState icon="shield" title="No open issues" description="Everything is running smoothly." compact />
      )}
      {status === "ready" && open.length > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View all alerts">
          <ul className="alerts-card">
            {open.map((alert) => (
              <li key={alert.id} className="alerts-card__item">
                <div className="alerts-card__head">
                  <Badge tone={SEVERITY_TONE[alert.severity]}>{alert.severity}</Badge>
                  <span className="alerts-card__time">{formatRelativeTime(alert.detectedAt)}</span>
                </div>
                <p className="alerts-card__title">{alert.title}</p>
                <p className="alerts-card__desc">{alert.description}</p>
                <p className="alerts-card__recommendation">{alert.recommendedAction}</p>
                <div className="alerts-card__actions">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); resolve(alert.id); }}>
                    {alert.actionLabel}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Alerts and problems" size="lg">
        <div className="card-detail">
          {items.length === 0 && <p className="card-detail__empty">No alerts on record.</p>}
          {open.length > 0 && (
            <>
              <p className="card-detail__heading">Open ({open.length})</p>
              <ul className="card-detail__list">
                {open.map((alert) => (
                  <li key={alert.id} className="card-detail__row">
                    <div className="card-detail__row-body">
                      <div className="alerts-card__head">
                        <Badge tone={SEVERITY_TONE[alert.severity]}>{alert.severity}</Badge>
                        <span className="alerts-card__time">{formatRelativeTime(alert.detectedAt)}</span>
                      </div>
                      <p className="card-detail__row-title">{alert.title}</p>
                      <p className="card-detail__row-meta">{alert.description}</p>
                      <p className="card-detail__row-meta">{alert.recommendedAction}</p>
                      <div className="alerts-card__actions">
                        <Button size="sm" variant="secondary" onClick={() => resolve(alert.id)}>
                          {alert.actionLabel}
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {resolved.length > 0 && (
            <>
              <p className="card-detail__heading">Resolved ({resolved.length})</p>
              <ul className="card-detail__list">
                {resolved.map((alert) => (
                  <li key={alert.id} className="card-detail__row">
                    <div className="card-detail__row-body">
                      <p className="card-detail__row-title">{alert.title}</p>
                      <p className="card-detail__row-meta">{formatRelativeTime(alert.detectedAt)}</p>
                    </div>
                    <Badge tone="good">Resolved</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>
    </Card>
  );
}

function severityRank(s: Severity) {
  return { critical: 3, serious: 2, warning: 1, info: 0 }[s];
}
