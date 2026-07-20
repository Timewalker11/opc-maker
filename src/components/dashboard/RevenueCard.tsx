import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { Sparkline } from "../ui/Sparkline";
import { ProgressBar } from "../ui/ProgressBar";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchRevenueSummary } from "../../services/analytics";
import { formatCurrency } from "../../utils/format";
import "./revenue-card.css";

export function RevenueCard() {
  const { status, data, reload } = useDashboardData(fetchRevenueSummary);
  const hasRevenue = !!data && data.trend.length > 0;

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
      {status === "error" && <ErrorState compact onRetry={reload} />}
      {status === "ready" && !hasRevenue && (
        <EmptyState
          icon="dollar-sign"
          title="No revenue data yet"
          description="Connect a payment or ecommerce platform to start tracking revenue."
          compact
          action={
            <Link to="/integrations" className="card-link">
              Connect Shopify <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && hasRevenue && data && (
        <div className="revenue-card">
          <div className="revenue-card__top">
            <div>
              <p className="revenue-card__figure">{formatCurrency(data.currentMonth)}</p>
              <DeltaBadge current={data.currentMonth} previous={data.previousMonth} />
            </div>
            <Sparkline values={data.trend} positive={data.currentMonth >= data.previousMonth} />
          </div>
          <div className="revenue-card__goal">
            <div className="revenue-card__goal-row">
              <span>Goal progress</span>
              <span>
                {formatCurrency(data.currentMonth)} of {formatCurrency(data.goal)}
              </span>
            </div>
            <ProgressBar value={data.currentMonth} max={data.goal} label="Monthly revenue goal progress" />
          </div>
        </div>
      )}
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
