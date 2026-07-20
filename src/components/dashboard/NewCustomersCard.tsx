import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchNewCustomersSummary } from "../../services/customers";
import "./new-customers-card.css";

export function NewCustomersCard() {
  const { status, data, reload } = useDashboardData(fetchNewCustomersSummary);

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
      {status === "error" && <ErrorState compact onRetry={reload} />}
      {status === "ready" && data?.thisWeek === 0 && (
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
      {status === "ready" && data && data.thisWeek > 0 && (
        <div className="new-customers-card">
          <p className="new-customers-card__figure">{data.thisWeek}</p>
          <NewCustomersDelta thisWeek={data.thisWeek} lastWeek={data.lastWeek} />
          <p className="new-customers-card__source">
            Top source: <strong>{data.topSource}</strong>
          </p>
        </div>
      )}
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
