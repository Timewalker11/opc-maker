import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Sparkline } from "../ui/Sparkline";
import { ProgressBar } from "../ui/ProgressBar";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useRevenueStore } from "../../store/revenueStore";
import { formatCurrency } from "../../utils/format";
import "./revenue-card.css";
import "./card-detail.css";

export function RevenueCard() {
  const status = useRevenueStore((s) => s.status);
  const currentMonth = useRevenueStore((s) => s.currentMonth);
  const previousMonth = useRevenueStore((s) => s.previousMonth);
  const goal = useRevenueStore((s) => s.goal);
  const trend = useRevenueStore((s) => s.trend);
  const load = useRevenueStore((s) => s.load);
  const hasRevenue = trend.length > 0;
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  return (
    <Card
      title="Revenue"
      icon={<Icon name="dollar-sign" size={16} />}
      headerAction={
        <Link to="/analytics" className="card-link">
          Full analytics <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={2} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && !hasRevenue && (
        <EmptyState
          icon="dollar-sign"
          title="No revenue data yet"
          description="Connect a payment or ecommerce platform to start tracking revenue."
          compact
          action={
            <Link to="/settings#integrations" className="card-link">
              Connect Shopify <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && hasRevenue && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View revenue details">
          <div className="revenue-card">
            <div className="revenue-card__top">
              <div>
                <p className="revenue-card__figure">{formatCurrency(currentMonth)}</p>
                <DeltaBadge current={currentMonth} previous={previousMonth} />
              </div>
              <Sparkline values={trend} positive={currentMonth >= previousMonth} />
            </div>
            <div className="revenue-card__goal">
              <div className="revenue-card__goal-row">
                <span>Goal progress</span>
                <span>
                  {formatCurrency(currentMonth)} of {formatCurrency(goal)}
                </span>
              </div>
              <ProgressBar value={currentMonth} max={goal} label="Monthly revenue goal progress" />
            </div>
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Revenue details">
        <div className="card-detail">
          <div className="card-detail__stats">
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">This month</span>
              <span className="card-detail__stat-value">{formatCurrency(currentMonth)}</span>
            </div>
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Last month</span>
              <span className="card-detail__stat-value">{formatCurrency(previousMonth)}</span>
            </div>
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Monthly goal</span>
              <span className="card-detail__stat-value">{formatCurrency(goal)}</span>
            </div>
          </div>
          <ProgressBar value={currentMonth} max={goal} label="Monthly revenue goal progress" />
          <p className="card-detail__heading">Trend (last {trend.length} months)</p>
          <ul className="card-detail__list">
            {trend.map((v, i) => (
              <li key={i} className="card-detail__row">
                <span className="card-detail__row-title">
                  {i === trend.length - 1 ? "This month" : `${trend.length - 1 - i} mo ago`}
                </span>
                <span className="card-detail__row-title">{formatCurrency(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </Card>
  );
}

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const pct = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);
  const positive = pct >= 0;
  return (
    <Badge tone={positive ? "good" : "critical"} icon={<Icon name={positive ? "arrow-up-right" : "arrow-down-right"} size={11} />}>
      {positive ? "+" : ""}
      {pct}% vs last month
    </Badge>
  );
}
