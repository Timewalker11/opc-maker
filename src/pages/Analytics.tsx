import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import type { BadgeTone } from "../components/ui/Badge";
import { Sparkline } from "../components/ui/Sparkline";
import { ProgressBar } from "../components/ui/ProgressBar";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchRevenueSummary } from "../services/analytics";
import { invoices } from "../mock/invoices";
import { orders } from "../mock/orders";
import { formatCurrency } from "../utils/format";

const INVOICE_TONE: Record<string, BadgeTone> = { paid: "good", pending: "neutral", overdue: "critical" };

export function Analytics() {
  const revenue = useDashboardData(fetchRevenueSummary);
  const hasRevenue = !!revenue.data && revenue.data.trend.length > 0;

  return (
    <div>
      <PageHeader title="Analytics" description="Revenue, invoices, and orders across your business." />

      <Card title="Revenue" subtitle="This month vs. last month">
        {revenue.status === "loading" && <CardSkeleton lines={2} />}
        {revenue.status === "error" && (
          <ErrorState title="Failed data synchronization" description="Analytics couldn't sync with your data sources." onRetry={revenue.reload} />
        )}
        {revenue.status === "ready" && !hasRevenue && (
          <EmptyState icon="bar-chart" title="No revenue data yet" description="Connect a payment or ecommerce platform to start tracking revenue." />
        )}
        {revenue.status === "ready" && hasRevenue && revenue.data && (
          <div className="analytics-revenue">
            <div>
              <p className="analytics-revenue__figure">{formatCurrency(revenue.data.currentMonth)}</p>
              <p className="record-row__subtitle">Goal: {formatCurrency(revenue.data.goal)}</p>
              <ProgressBar value={revenue.data.currentMonth} max={revenue.data.goal} label="Revenue goal progress" />
            </div>
            <Sparkline values={revenue.data.trend} width={220} height={64} positive={revenue.data.currentMonth >= revenue.data.previousMonth} />
          </div>
        )}
      </Card>

      <div className="page-grid section-spacing-top">
        <Card title="Invoices">
          {invoices.length === 0 ? (
            <EmptyState icon="dollar-sign" title="No invoices yet" description="Invoices will show up here once you create one." />
          ) : (
            <ul className="record-list">
              {invoices.map((inv) => (
                <li key={inv.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{inv.customerName}</p>
                    <p className="record-row__subtitle">Invoice {inv.id.replace("inv_", "#")}</p>
                  </div>
                  <div className="record-row__end">
                    <span className="record-row__amount">{formatCurrency(inv.amount)}</span>
                    <Badge tone={INVOICE_TONE[inv.status]}>{inv.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recent orders">
          {orders.length === 0 ? (
            <EmptyState icon="dollar-sign" title="No orders yet" description="Orders will show up here once your store starts selling." />
          ) : (
            <ul className="record-list">
              {orders.map((o) => (
                <li key={o.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{o.customerName}</p>
                    <p className="record-row__subtitle">via {o.source}</p>
                  </div>
                  <span className="record-row__amount">{formatCurrency(o.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
