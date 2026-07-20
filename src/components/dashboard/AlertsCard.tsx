import { useEffect } from "react";
import type { Severity } from "../../types";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import type { BadgeTone } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useAlertsStore } from "../../store/alertsStore";
import { formatRelativeTime } from "../../utils/format";
import "./alerts-card.css";

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

  return (
    <Card title="Alerts and problems" icon={<Icon name="alert-triangle" size={16} />}>
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && open.length === 0 && (
        <EmptyState icon="shield" title="No open issues" description="Everything is running smoothly." compact />
      )}
      {status === "ready" && open.length > 0 && (
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
                <Button size="sm" variant="secondary" onClick={() => resolve(alert.id)}>
                  {alert.actionLabel}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function severityRank(s: Severity) {
  return { critical: 3, serious: 2, warning: 1, info: 0 }[s];
}
